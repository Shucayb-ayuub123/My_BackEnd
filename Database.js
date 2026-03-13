// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();

// const Mysql = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });
// Mysql.getConnection()
//   .then(conn => {
//     console.log("✅ MySQL Connected");
//     conn.release();
//   })
//   .catch(err => {
//     console.error("❌ MySQL Connection Failed:", err.message);
//   });

// export default Mysql;


import {Pool} from "pg"

// Replace with your Neon connection string
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Mj3dg7ifBSbn@ep-cold-smoke-a490myz2-pooler.us-east-1.aws.neon.tech/Todo_DB?sslmode=verify-full',
  ssl: {
    rejectUnauthorized: false, // important for Neon
  },
});

pool.on("connect", () => {
  console.log("Connected to Neon PostgreSQL!");
});

export default pool;