import express from "express";
import db from "../Database.js";

// Post
const CreateTask = async (req, res) => {
  
  try {
    const { Task_title, Description, Date1, complete } = req.body;
    const {id} = req.user

    const sql = "INSERT INTO tasks (Task_title, Description, Date1, complete , User_id) VALUES (?,?, ?, ?, ?)";

    const [result] = await db.query(sql, [
      Task_title,
      Description,
      Date1,
      complete,
      id,
    ]);

    return res.status(200).json({
      message: "Task inserted",
      insertId: result.insertId,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default CreateTask;
// select
export const Select_Task = async (req, res) => {
  const {id} = req.user
  try {
    const sql = `
      SELECT 
        T.Task_id,
        T.Task_title,
        T.Description,
        T.Date1,
        T.complete
      FROM tasks T
      INNER JOIN user_check U ON ${id} = U.ID
    `;

    const [rows] = await db.query(sql);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Database query error:", err);
    return res.status(500).json(err);
  }
};

// Update

export const UpdateTask = async (req, res) => {
  try {
    const { Task_id } = req.params;
    const { Task_title, Description, Date1 } = req.body;

    const formattedDate = Date1
      ? new Date(Date1).toISOString().split("T")[0]
      : null;

    const sql = `
      UPDATE tasks
      SET Task_title = ?, Description = ?, Date1 = ?
      WHERE Task_id = ?
    `;

    const [result] = await db.query(sql, [
      Task_title,
      Description,
      formattedDate,
      Task_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Delete

export const DeleteTask = async (req, res) => {
  try {
    const { Task_id } = req.params;

    const sql = "DELETE FROM tasks WHERE Task_id = ?";

    const [result] = await db.query(sql, [Task_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const ToggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = "UPDATE tasks SET complete = NOT complete WHERE Task_id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Completed status toggled" });
  } catch (err) {
    return res.status(500).json(err);
  }
};