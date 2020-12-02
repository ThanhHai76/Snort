const express = require("express");
const router = express.Router();
const sendMail = require("../controllers/sendmailController");
const db = require("../config/database");

router.get("/", (req, res) => {
  res.render("home", {});
  sendMail;
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
          // sendMail;
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
          for(let i = 0 ; i < size ; i ++){
            data.push(info[i])
          }
          // console.log(data);
          res.render("email", { data: data });
        })
        .then(() => {
          // sendMail;
          conn.end();
        });
    })
    .catch((err) => {
      //handle error
      console.log(err);
      conn.end();
    });
});

router.post("/submit", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  db.getConnection()
    .then((conn) => {
      conn
        .query(
          `SELECT email FROM email WHERE email = '${email}'`
        )
        .then((email_sl) => {
          if(email_sl == ''){
            conn.query(`INSERT INTO email(name,email,phone) VALUES('${name}','${email}','${phone}')`).then(()=>{
              console.log("A user has just registered ");
              res.redirect("/success");
            })
          } else{
            conn.query(`UPDATE email SET name = '${name}', email = '${email}', phone = '${phone}' WHERE email = '${email}'`).then(()=>{
              console.log("User update success!");
              res.redirect("/success");
            })
          }
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

router.get("/success", (req, res) => {
  res.render("success", {
    message: "You have just registered your email successfully",
  });
});

module.exports = router;
