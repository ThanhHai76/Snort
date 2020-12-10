const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", (req, res) => {
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
                    conn.query("SELECT * from email").then((info) => {
                      let email = [];
                      let size = info.length;
                      for (let i = 0; i < size; i++) {
                        email.push(info[i]);
                      }

                      res.render("index", {
                        title: "Snort log information",
                        data: data,
                        sig: sig,
                        email: email,
                      });
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
