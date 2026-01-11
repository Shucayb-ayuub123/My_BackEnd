import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const Mysql = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  ssl: {
    rejectUnauthorized: false
  }
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
