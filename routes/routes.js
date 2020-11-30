const express = require("express");
const router = express.Router();
const sendMail = require("../controllers/mysqlController");
const db = require("../config/database");

router.get("/", (req,res)=>{
  res.render("home",{});
})

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

router.get("/signature", (req, res) => {
  db.getConnection()
    .then((conn) => {
      conn
        .query("SELECT sig_id, sig_name from signature")
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

router.get("/email", (req, res) => {
  db.getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from email")
        .then((info) => {
          var data = info[0];
          res.render("email", { data: data });
        })
        .then(() => {
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

router.post("/submit", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  db.getConnection()
    .then((conn) => {
      conn
        .query(
          `INSERT INTO email(name,email,phone) VALUES('${name}','${email}','${phone}')`
        )
        .then((submit) => {
          console.log("A user has just registered " + submit);
          res.redirect("/success");
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
