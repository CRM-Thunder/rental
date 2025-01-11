const mysql = require('mysql2/promise');
const fs=require('fs');
const caCert=fs.readFileSync('./cert/ca-cert.pem');
const master_db_config = {
  host: "127.0.0.1",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.MASTER_PORT,
  ssl: {
    ca:caCert
  }
};

const slave_db_config = {
  host: "127.0.0.1",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.SLAVE_PORT,
  ssl: {
    ca:caCert
  }
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


module.exports = {
  connectDatabases,
  getMasterDb: () => master_db,
  getSlaveDb: () => slave_db,
};