import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import { faker } from '@faker-js/faker';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//const express = require('express');

// Example route
//app.get('/api/some-endpoint', (req, res) => 
//{
    //const userIp = req.userIp; 
    //res.json({ message: `Your IP is ${userIp}` }); 
//});

//app.listen(3000, () => console.log('Server running on port 3000'));

// Root route
app.get("/", (req, res) => 
{
    res.send("Server is on... 👅");
});

// Database connection test
app.get("/api/test-db", async (req, res) => 
{
    try {
        const result = await db.query("SELECT NOW()");
        res.json({ connected: true, time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ connected: false });
    }
});

app.get("/api/users", async (req,res)=>
{
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

app.post("/api/users", async (req, res) => 
{
    try 
    {
        const result = await db.query(
        "INSERT INTO users DEFAULT VALUES RETURNING *"
        );
        res.json(result.rows[0]); // should contain the new row
    } catch (err) {
        console.error("Error inserting user:", err);
        res.status(500).json({ error: "DB insert failed" });
    }
});

// After game is finished, query database with a new score and return user object row if valid request
async function updateScore(id, score) 
{

    // Validate score range
    if (score < 0 || score > 20) 
    {
        throw new Error(`Invalid score: ${score}. Score must be between 0 and 20.`);
    }

    // Validate that score is a number
    if (typeof score !== 'number' || isNaN(score)) 
    {
        throw new Error(`Invalid score type: ${typeof score}. Score must be a number.`);
    }

    const query = `
        UPDATE users
        SET played_today = TRUE,
            daily_score = $2,
            total_games = total_games + 1,
            avg_score = ((avg_score * (total_games) + $1) / (total_games + 1))
        WHERE id = $1
        RETURNING *;
    `;

    const values = [id, score];

    try
    {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error("Error updating score: ", err);
        throw err;
    }
}

// id and word integer
async function updateProgress(id, wordNumber) 
{
    const query = 
    `
    UPDATE users
    SET progress_today = $2-1,
    WHERE id = $1,
    RETURNING *;
    `

    try
    {
        const result = await db.query(query, [id, wordNumber]);
        return result.rows[0];
    }catch (err){
        console.error("Error updating progress: ", err);
        throw err;
    }
}

async function updateUsername(id, newName) 
{
    
}


app.post("/api/new-user", async (req, res) =>
{
    try
    {
        const result = await db.query(
            "INSERT INTO users DEFAULT VALUES RETURNING id;"
        );
        const newID = result.rows[0].id;
        res.json({ id: newID });
        console.log(`new id: ${newID}`);
    } catch (err) {
        console.error("DB insert error: ",err.message);
        res.status(500).json({ error: "Database insert failed" });
    }
});

app.post("/api/update-score", async (req, res) => 
{
    const { id, newScore } = req.body;

    try
    {
        const user = await updateScore(id, newScore);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to update score" });
    }
    
});


// Danger: Debug-only route to clear all users
app.delete("/api/debug/reset-users", async (req, res) => 
{
    try 
    {
        await db.query("TRUNCATE TABLE users CASCADE;");
        res.json({ success: true, message: "All users reset." });
    } catch (err) {
        console.error("Error resetting users:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


// Debug: populate with random users
app.post("/api/debug/populate-users", async (req, res) => 
{
    try 
    {
        const count = req.body.count || 5; // default to 5 fake users

        const insertedUsers = [];
        for (let i = 0; i < count; i++) 
        {
            const dailyScore = Math.floor(Math.random() * 20);
            const totalGames = Math.floor(Math.random() * 20) + 1;
            const avgScore = (dailyScore / totalGames).toFixed(2);

            const result = await db.query(
                `INSERT INTO users (played_today, daily_score, avg_score, total_games) 
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [Math.random() > 0.5, dailyScore, avgScore, totalGames]
            );

            insertedUsers.push(result.rows[0]);
        }

        res.json({ success: true, inserted: insertedUsers.length, users: insertedUsers });
        
    } catch (err) {
        console.error("Populate failed:", err);
        res.status(500).json({ error: "DB populate failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
