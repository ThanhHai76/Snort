//Database
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "192.168.1.223",
  user: "root",
  password: "07061998",
  database: "snort"
});
module.exports = pool;