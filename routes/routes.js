const express = require("express");
const router = express.Router();
const db = require("../config/database");
const convert = require("../utils/convert_IP");

router.get("/", (req, res) => {
  db.getConnection()
    .then((conn) => {
      conn
        .query("SELECT cid, signature, timestamp from event")
        .then((rows) => {
          let size = rows.length;
          let data = [];
          for (let i = size - 50; i < size; i++) {
            data.push(rows[i]);
          }
          conn
            .query("SELECT sig_id, sig_name, sig_sid, sig_gid from signature")
            .then((sig_db) => {
              let sig = [];
              let size = sig_db.length;
              for (let i = size - 50; i < size; i++) {
                sig.push(sig_db[i]);
              }
              conn.query("SELECT * from email").then((info) => {
                let email = [];
                let size = info.length;
                for (let i = 0; i < size; i++) {
                  email.push(info[i]);
                }
                conn
                  .query(
                    "SELECT cid, ip_src, ip_dst, ip_id, ip_csum from iphdr"
                  )
                  .then((ip_db) => {
                    let ip = [];
                    let ip_src = [];
                    let ip_dst = [];
                    let size = ip_db.length;
                    for (let i = size - 50; i < size; i++) {
                      ip.push(ip_db[i]);
                      ip_src.push(convert.convert_Decimal_To_IPv4(ip_db[i].ip_src));
                      ip_dst.push(convert.convert_Decimal_To_IPv4(ip_db[i].ip_dst));
                    }
                    // console.log(ip_src);

                    res.render("index", {
                      title: "Snort log information",
                      data: data,
                      sig: sig,
                      ip: ip,
                      ip_src: ip_src,
                      ip_dst: ip_dst,
                      email: email,
                    });
                  });
              });
            });
        })
        .then(() => {
          conn.end();
        });
    })
    .catch((err) => {
      //handle error
      console.log(err);
      conn.end();
    });
});

router.get("/event", (req, res) => {
  db.getConnection()
    .then((conn) => {
      conn
        .query("SELECT cid, signature, timestamp from event")
        .then((rows) => {
          conn.query("SELECT count(*) as number from event").then((count) => {
            let size = count[0].number;
            let data = [];
            for (let i = size - 10; i < size; i++) {
              data.push(rows[i]);
            }
            res.render("event", {
              title: "Snort log information",
              data: data,
            });
          });
        })
        .then(() => {
          conn.end();
        });
    })
    .catch((err) => {
      //handle error
      console.log(err);
      conn.end();
    });
});

router.get("/signature", (req, res) => {
  db.getConnection()
    .then((conn) => {
      conn
        .query("SELECT sig_id, sig_name, sig_sid, sig_gid from signature")
        .then((sig_db) => {
          conn
            .query("SELECT count(*) as number from signature")
            .then((count) => {
              let sig = [];
              let size = count[0].number;
              for (let i = size - 10; i < size; i++) {
                sig.push(sig_db[i]);
              }
              res.render("signature", { sig: sig });
            });
        })
        .then(() => {
          conn.end();
        });
    })
    .catch((err) => {
      //handle error
      console.log(err);
      conn.end();
    });
});

router.get("/email", (req, res) => {
  db.getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from email")
        .then((info) => {
          let data = [];
          let size = info.length;
          for (let i = 0; i < size; i++) {
            data.push(info[i]);
          }
          // console.log(data);
          res.render("email", { data: data });
          // sendMail;
        })
        .then(() => {
          conn.end();
        });
    })
    .catch((err) => {
      //handle error
      console.log(err);
      conn.end();
    });
});

module.exports = router;
