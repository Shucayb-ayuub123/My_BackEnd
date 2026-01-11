import db from "../Database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const SignUp = async (req, res) => {
  
  const { Name, Email, password } = req.body;
    console.log(req.body);
    
   if (!Name || !Email || !password) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields"
  });
}

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM user_check WHERE Email = ?",
      [Email]
    );

    if (existingUser.length > 0) {
      return res
        .status(403)
        .json({ success: false, message: "User already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO user_check (Name, Password, Email) VALUES (?,?,?)",
      [Name, hashPass, Email]
    );

    return res.status(200).json({
      success: true,
      message: "Successfully signed up",
      userId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const Login = async (req, res) => {
  const { Email, password } = req.body;
  try {
    // Use await db.query
    const [data] = await db.query("SELECT * FROM user_check WHERE Email = ?", [
      Email,
    ]);

    if (data.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const user = data[0];

    if (!user.password) {
      return res
        .status(500)
        .json({ success: false, message: "User password not set in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { id: user.ID, email: user.Email },
      process.env.JW_SECRET,
      { expiresIn: "10y" }
    );

    return res.status(200).json({
      success: true,
      message: "Login success",
      token,
      user: { id: user.ID, name: user.Name, email: user.Email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     const { Email } = req.body;
//     console.log("Email:", Email);

//     const [rows] = await db.query("SELECT * FROM user_check WHERE Email = ?", [
//       Email,
//     ]);
//     console.log("Rows:", rows);

//     if (!rows[0]) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("JW_SECRET:", process.env.JW_SECRET);

//     const user = rows[0];
//     const secret = process.env.JW_SECRET + user.password;

//     const token = jwt.sign({ id: user.ID, email: user.Email }, secret, {
//       expiresIn: "15m",
//     });

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.verify();
//     console.log("Transport verified");

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: Email,
//       subject: "Reset Password",
//       text: "Test reset email",
//     });

//     res.json({ message: "Email sent" });
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