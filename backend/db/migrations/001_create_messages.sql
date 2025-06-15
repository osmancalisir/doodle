-- backend/db/migrations/001_create_messages.sql

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
