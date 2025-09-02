import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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

app.get("/api/users", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        console.error("Error querying users table:", err);
        res.status(500).json({ error: "DB query failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
