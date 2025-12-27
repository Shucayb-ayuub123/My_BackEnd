import express from "express";
import {
  SignUp,
  Login,
  // forgotPassword,
  // ResetPass,
} from "../Controller/Auth.js";
import {verifyToken} from "../middleware/authentification.js"
const Router = express.Router();

Router.post("/Singup" ,  SignUp);
Router.post("/Login", Login);
// Router.post("/forgot-password", forgotPassword);
// Router.post("/reset-password/:id/:token", ResetPass);

export default Router;