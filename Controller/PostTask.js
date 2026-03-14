


import express from "express";
import pool from "../Database.js";

// Post
export const CreateTask = async (req, res) => {
  
  try {
    const { task_title, description, date1, complete } =  req.body;
    const {id} = req.user
   
    console.log(task_title, description, date1, complete)
    console.log(id)
    const sql =  `INSERT INTO tasks (task_title, description, date1, complete , user_id)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING task_id`

    const result = await pool.query(sql, [
      task_title,
      description,
      date1,
      complete,
      id,
    ]);

    return res.status(200).json({
      message: "Task inserted",
      insertId: result.insertId,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
};


// select
export const Select_Task = async (req, res) => {
  const {id} = req.user
  try {
    const sql = `
      SELECT 
        T.task_id,
        T.task_title,
        T.description,
        T.date1,
        T.complete
      FROM tasks T
      INNER JOIN user_check U ON ${id} = U.id
    `;

    const rows = await pool.query(sql);

    return res.status(200).json(rows.rows);
  } catch (err) {
    console.error("Database query error:", err);
    return res.status(500).json(err);
  }
};

// Update

export const UpdateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { task_title, description, date1 } = req.body;

    const formattedDate = date1
      ? new Date(date1).toISOString().split("T")[0]
      : null;

    const sql = `
      UPDATE tasks
      SET task_title = $1, description = $2, date1 = $3
      WHERE task_id = $4
    `;

    const result = await pool.query(sql, [
      task_title,
      description,
      formattedDate,
      task_id,
    ]);

    if (result.rowCount === 0) {
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
    const { task_id } = req.params;
    console.log(task_id)
    const sql = "DELETE FROM tasks WHERE task_id = $1";

    const result = await pool.query(sql, [task_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
};

export const ToggleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "UPDATE tasks SET complete = NOT complete WHERE task_id = $1";

    const result = await pool.query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Completed status toggled" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};