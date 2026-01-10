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

export default Router;