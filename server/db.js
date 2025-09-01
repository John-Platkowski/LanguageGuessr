import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Connected to Postgres!"))
  .catch(err => console.error("Postgres connection error:", err.stack));

export default pool;
