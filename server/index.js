import pg from "pg";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Get all users
app.get("/api/users", async (req, res) => 
{
    try 
    {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB query failed" });
    }
});