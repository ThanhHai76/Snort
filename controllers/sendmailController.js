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
            console.log("time to out " + max_time);
            let check;
            socket.emit("check-reload");
            socket.on("reload", function () {
              check == true;
              console.log("page reload");
            });

            let time_to_send = setInterval(() => {
              current++;
              TimeToSend();
              if (current == 20) setTimeout(reset, 1000);
              
              if(check == true) reset();
            }, 1000);

            function TimeToSend() {
              conn
                .query("SELECT max(timestamp) as time from event")
                .then((latest) => {
                  let time_latest = latest[0].time;
                  // console.log("time latest " + time_latest);
                  console.log(current);
                  if (time_latest > max_time && current == 2) {
                    socket.emit("send-alert", { data: time_latest });
                    send_mail();
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

      function send_mail() {
        conn.query("SELECT email FROM email").then((list) => {
          let list_email = [];
          for (let i = 0; i < list.length; i++) {
            list_email.push(list[i].email);
          }
          // mailer.sendMail(list_email, "SNORT ALERT", time_latest);
          console.log("send mail " + list_email);
        });
      }
    })
    .catch((err) => {
      //not connected
      console.log(err);
      conn.end();
    });
};

// module.exports = {
//   connect_sendmail: connect_sendmail,
// };
