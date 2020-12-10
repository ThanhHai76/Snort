const db = require("../config/database");
const mailer = require("../utils/mailer");

exports.sendmail = function (socket) {
  db.getConnection()
    .then((conn) => {
      // let time_to_out = setInterval(TimeToOut,1000);
      TimeToOut();
      let current = 0;
      function TimeToOut() {
        conn
          .query("SELECT max(timestamp) as max_time from event")
          .then((max) => {
            let max_time = max[0].max_time;
            // console.log("time to out " + formatDate(max_time));
            socket.emit("check-reload");

            let time_to_send = setInterval(() => {
              current++;
              TimeToSend();
              if (current == 5) setTimeout(reset, 1000);
            }, 1000);

            function TimeToSend() {
              conn
                .query("SELECT max(timestamp) as time from event")
                .then((latest) => {
                  let time_latest = latest[0].time;
                  // console.log("time latest " + formatDate(time_latest));
                  // console.log(current);
                  if (time_latest > max_time && current == 2) {
                    socket.emit("send-alert", {
                      data:
                        "Your laptop has a instrusion at " +
                        formatDate(time_latest),
                    });
                    send_mail(conn, time_latest);
                  }
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

function send_mail(conn, time) {
  conn.query("SELECT email FROM email").then((list) => {
    let list_email = [];
    for (let i = 0; i < list.length; i++) {
      list_email.push(list[i].email);
      mailer.sendMail(
        list_email[i],
        "SNORT ALERT",
        "Your laptop has a instrusion at " + time
      );
    }
    console.log("send mail to " + list_email);
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
