const mysql = require('mysql2/promise');

const master_db_config = {
  host: "127.0.0.1",
  user: "root",
  password: "root_password",
  database: "wypozyczalnia",
  port: 10001
};

const slave_db_config = {
  host: "127.0.0.1",
  user: "root",
  password: "root_password",
  database: "wypozyczalnia",
  port: 10002
};

let master_db, slave_db;

// Funkcja do nawiązania połączenia z bazami danych
async function connectDatabases() {
  try {
    if (!master_db || !slave_db) {
      master_db = await mysql.createConnection(master_db_config);
      console.log("Connected to MySQL master database");

      slave_db = await mysql.createConnection(slave_db_config);
      console.log("Connected to MySQL slave database");
    }
    return { master_db, slave_db };
  } catch (err) {
    console.error("Error connecting to MySQL:", err.message);
    throw err;
  }
}

// Eksportujemy funkcję asynchroniczną, która gwarantuje połączenia
module.exports = {
  connectDatabases,
  getMasterDb: () => master_db,
  getSlaveDb: () => slave_db,
};