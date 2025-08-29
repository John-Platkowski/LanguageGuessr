// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to Postgres
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test route
app.get("/api/hello", (req, res) => 
{
    res.json({ message: "Backend is working!" });
});

// Test DB connection
app.get("/api/test-db", async (req, res) => 
{
    try 
    {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
    }
});

app.listen(PORT, () => 
{
    console.log(`Server running on http://localhost:${PORT}`);
});
