const db = require("../config/database");
const mailer = require("../utils/mailer");
const convert = require("../utils/convert_IP");

exports.sendmail = function (socket) {
  db.getConnection()
    .then((conn) => {
      TimeToOut();
      let current = 0;

      function TimeToOut() {
        conn
          .query("SELECT max(timestamp) as max_time, max(cid) as max_cid from event")
          .then((max) => {
            let max_time = max[0].max_time;
            let max_cid = max[0].max_cid;

            let time_to_send = setInterval(() => {
              current++;
              TimeToSend();
              if (current === 3) reset();
            }, 1000);

            function TimeToSend() {
              conn.query(`SELECT signature from event WHERE event.cid = ${max_cid}`).then((sig_db) => {
                conn
                  .query(
                    "SELECT max(timestamp) as time from event"
                  )
                  .then((latest) => {
                    let attack;
                    let time_latest = latest[0].time;
                    let sig = sig_db[0].signature;
                    if (sig == 524) attack = "SYN Scan";
                    if (sig == 535) attack = "ICMP test";
                    if (sig == 536) attack = "Ping of Death";
                    if (sig == 537) attack = "Smurf";
                    console.log(current);
                    conn
                      .query("SELECT ip_src, ip_dst from iphdr")
                      .then((ip) => {
                        let max = ip.length - 1;
                        let ip_src = convert.convert_Decimal_To_IPv4(
                          ip[max].ip_src
                        );
                        let ip_dst = convert.convert_Decimal_To_IPv4(
                          ip[max].ip_dst
                        );

                        if (time_latest > max_time && current === 1) {
                          socket.emit("send-alert", {
                            data:
                              "Your laptop has a instrusion at " +
                              formatDate(time_latest) +
                              ", attack " +
                              attack,
                          });
                          send_mail(conn, time_latest, attack, ip_src, ip_dst);
                        }
                      });
                  });
              });
            }
            function reset() {
              current = 0;
              clearInterval(time_to_send);
              TimeToOut();
            }
          });
      }
    })
    .catch((err) => {
      //not connected
      console.log(err);
      conn.end();
    });
};

function send_mail(conn, time, attack, ip_src, ip_dst) {
  conn.query("SELECT email FROM email").then((list) => {
    let list_email = [];
    for (let i = 0; i < list.length; i++) {
      list_email.push(list[i].email);
      mailer.sendMail(
        list_email[i],
        "SNORT ALERT",
        "Your laptop has a instrusion at " + time,
        "Attack type: " + attack,
        "IP_source: " + ip_src,
        "IP_destination " + ip_dst
      );
    }
    console.log("send mail to " + list_email + ip_src + ip_dst);
  });
}

function formatDate(date) {
  // format the date
  // add leading zeroes to single-digit day/month/hours/minutes
  let d = date;
  d = [
    "0" + d.getDate(),
    "0" + (d.getMonth() + 1),
    "" + d.getFullYear(),
    "0" + d.getHours(),
    "0" + d.getMinutes(),
  ].map((component) => component.slice(-2)); // take last 2 digits of every component

  // join the components into date
  return d.slice(3).join(":") + " " + d.slice(0, 3).join(".");
}
