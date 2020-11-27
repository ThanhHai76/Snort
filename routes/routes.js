const express = require("express");
const router = express.Router();
const sendMail = require("../controllers/mysqlController");
const db = require("../config/database");
const { query } = require("../config/database");

router.get("/", (req, res) => {
  db.getConnection()
    .then((conn) => {
      conn
        .query("SELECT cid, signature, timestamp from event")
        .then((rows) => {
          let cid = [];
          let sig = [];
          let time = [];
          for (let i = 0; i < 24; i++) {
            cid.push(rows[i].cid);
            sig.push(rows[i].signature);
            time.push(formatDate(rows[i].timestamp));
          }
          res.render("home", {
            title: "Snort log information",
            cid: cid,
            sig: sig,
            time: time
          });
        })
        .then((res) => {
          sendMail;
          conn.end();
        });
    })
    .catch((err) => {
      //handle error
      console.log(err);
      conn.end();
    });
});

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

module.exports = router;
