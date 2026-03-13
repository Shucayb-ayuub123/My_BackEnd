import pool from "../Database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const SignUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const results = await pool.query(
      "SELECT * FROM user_check WHERE email = $1",
      [email],
    );
    const existingUser = results.rows;

    if (existingUser.length > 0) {
      return res
        .status(403)
        .json({ success: false, message: "User already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO user_check (name, password, email) VALUES ($1,$2,$3)",
      [name, hashPass, email],
    );

    return res.status(200).json({
      success: true,
      message: "Successfully signed up",
      userId: result.insertId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM user_check WHERE email = $1",
      [email]
    );

    console.log(result.rows)
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0]; // ✅ get first user

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JW_SECRET,
      { expiresIn: "10y" }
    );

    return res.status(200).json({
      success: true,
      message: "Login success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log("email:", email);

//     const [rows] = await pool.query("SELECT * FROM user_check WHERE email = ?", [
//       email,
//     ]);
//     console.log("Rows:", rows);

//     if (!rows[0]) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("JW_SECRET:", process.env.JW_SECRET);

//     const user = rows[0];
//     const secret = process.env.JW_SECRET + user.password;

//     const token = jwt.sign({ id: user.ID, email: user.email }, secret, {
//       expiresIn: "15m",
//     });

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.email_USER,
//         pass: process.env.email_PASS,
//       },
//     });

//     await transporter.verify();
//     console.log("Transport verified");

//     await transporter.sendMail({
//       from: process.env.email_USER,
//       to: email,
//       subject: "Reset Password",
//       text: "Test reset email",
//     });

//     res.json({ message: "email sent" });
//   } catch (error) {
//     console.error("FORGOT ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const ResetPass = async (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   try {
//     const [user] = await db.query("SELECT * FROM user_task where ID=  ?", [id]);
//     if (!user[0]) return res.status(404).json({ message: "user not found" });
//     const secret = process.env.JW_SECRET + user[0].password;
//     jwt.verify(token, secret);
//     const hashPass = await bcrypt.hash(password, 10);

//     await db.query("UPDATE user_task SET password = ? where ID = ? ", [
//       hashPass,
//       id,
//     ]);
//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token or expired " });
//   }
// };
