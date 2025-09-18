CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    played_today BOOLEAN DEFAULT FALSE,
    progress_today INTEGER DEFAULT 0,
    daily_score INTEGER DEFAULT 0,
    avg_score NUMERIC(5,2) DEFAULT 0.00,
    total_games INTEGER DEFAULT 0
);