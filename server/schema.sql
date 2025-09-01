CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    played_today BOOLEAN DEFAULT FALSE,
    daily_score INTEGER DEFAULT 0,
    avg_score NUMERIC(5,2) DEFAULT 0.00,
    total_games INTEGER DEFAULT 0
);