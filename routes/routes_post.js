const express = require("express");
const router = require("./routes");
const db = require("../config/database");

exports.success = function (socket) {
  router.post("/submit", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    db.getConnection()
      .then((conn) => {
        conn
          .query(`SELECT phone FROM email WHERE phone = '${phone}'`)
          .then((phone_s) => {
            if (phone_s == "") {
              conn
                .query(
                  `INSERT INTO email(name,email,phone) VALUES('${name}','${email}','${phone}')`
                )
                .then(() => {
                  console.log("A user has just registered ");
                  res.redirect("/");
                  socket.emit(
                    "success-message",
                    {msg:"You have just registered your email successfully"}
                  );
                });
            } else {
              conn
                .query(
                  `UPDATE email SET name = '${name}', email = '${email}', phone = '${phone}' WHERE phone = '${phone}'`
                )
                .then(() => {
                  console.log("User update success!");
                  res.redirect("/");
                  socket.emit(
                    "success-message",
                    {msg:"You have just registered your email successfully"}
                  );
                });
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
};
