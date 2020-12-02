const db = require("../config/database");
const mailer = require("../utils/mailer");

const connect_sendmail = db
  .getConnection()
  .then((conn) => {
    let current = 0;
    let time_to_out = setInterval(() => {
      conn.query("SELECT max(timestamp) as max_time from event").then((max) => {
        let max_time = max[0].max_time;
        let time_to_send = setInterval(() => {
          conn
            .query("SELECT max(timestamp) as time from event")
            .then((latest) => {
              current++;
              let time_latest = latest[0].time;
              if (time_latest > max_time && current == 10) {
                // console.log("snort detect a intrustion");
                conn.query("SELECT email FROM email").then((list) => {
                  let list_email = [];
                  for (let i = 0; i < list.length; i++) {
                    list_email.push(list[i].email);
                  }
                  // mailer.sendMail(list_email, "SNORT ALERT", time_latest);
                  console.log("send mail " + list_email);
                  clearInterval(time_to_send);
                });
              }
              if (current == 20 && time_latest > max_time) {
                current = 0;
                console.log("send mail again !");
                clearInterval(time_to_send);
              }
            });
        }, 2000);
      });
    }, 1000)
  })
  .catch((err) => {
    //not connected
    console.log(err);
    conn.end();
  });

module.exports = {
  connect_sendmail: connect_sendmail,
};
