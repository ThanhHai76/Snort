//Database
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "192.168.43.134",
  // host: "192.168.1.223",
  user: "root",
  password: "07061998",
  database: "snort"
});

// const pool = mariadb.createPool({
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
//   database: "snort"
// });

module.exports = pool;