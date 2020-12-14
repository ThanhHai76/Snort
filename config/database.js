//Database
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "192.168.43.134",
  user: "root",
  password: "07061998",
  database: "snort"
});
module.exports = pool;