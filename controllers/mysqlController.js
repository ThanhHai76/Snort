const mariadb = require("mariadb");
const db = require("../config/database");

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
    "0" + d.getSeconds(),
  ].map((component) => component.slice(-2)); // take last 2 digits of every component

  // join the components into date
  return d.slice(0, 3).join(".") + " " + d.slice(3).join(":");
}

const connect_sendmail = db.getConnection()
  .then((conn) => {
    conn
      .query("SELECT cid,signature from event")
      .then((rows) => {
        conn.query("SELECT count(*) as number from event").then((count)=>{
          let size = count[0].number;
          let list = [];
          for (let i = (size - 10); i< size; i++) {
            list.push(rows[i]);
          }
          // console.log(size);
          // console.log(list);
        });
        return conn.query("SELECT max(timestamp) as number from event");
      })
      .then((res) => {
        let content = formatDate(res[0].number);
        // console.log(content);
        // mailer.sendMail('SNORT ALERT', content);
        conn.end();
      })
      .catch((err) => {
        //handle error
        console.log(err);
        conn.end();
      });
  })
  .catch((err) => {
    //not connected
  });

module.exports = {
  connect_sendmail: connect_sendmail,
};
