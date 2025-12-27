import express from "express";
import { Select_Task  , UpdateTask , DeleteTask  ,ToggleTask } from "../Controller/PostTask.js";
import CreateTask from '../Controller/PostTask.js'
import { verifyToken } from "../middleware/authentification.js";

const router = express.Router();
router.post("/User_Task", verifyToken , CreateTask);
router.get("/Select_Task", verifyToken , Select_Task);
router.put("/EditTask/:Task_id", UpdateTask);
router.delete("/DeleteTask/:Task_id", DeleteTask);
router.put("/ToggleTask/:id", ToggleTask);



export default router;