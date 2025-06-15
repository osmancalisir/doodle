-- backend/db/migrations/002_create_rooms.sql

CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE messages
ADD COLUMN room_id VARCHAR(36) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE;

CREATE INDEX idx_messages_room_id ON messages(room_id);
