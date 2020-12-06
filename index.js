const express = require("express");
const app = express();
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const db = require("./config/database");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const connect_sendmail = require("./controllers/sendmailController");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use("/", routes);

io.on("connection", function (socket) {
  console.log("Co nguoi vua ket noi " + socket.id);
  connect_sendmail.sendmail(socket);
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running at localhost:${port}`);
});
