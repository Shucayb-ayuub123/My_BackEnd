import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const Mysql = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
Mysql.getConnection()
  .then(conn => {
    console.log("✅ MySQL Connected");
    conn.release();
  })
  .catch(err => {
    console.error("❌ MySQL Connection Failed:", err.message);
  });

export default Mysql;
