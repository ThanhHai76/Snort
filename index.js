const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const db = require("./config/database");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use("/", routes);


db.getConnection((err)=>{
  if(err){
    console.log('Connection error', err);
    return;
  }
  console.log('connection success');
})

// db state
app.use(function (req, res, next) {
  req.connect = pool;
  next();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`);
});
