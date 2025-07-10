/*
  # Real-time Chat System

  1. New Tables
    - `chat_rooms`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `farmer_id` (uuid, references users)
      - `driver_id` (uuid, references users)
      - `status` (enum: active, closed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references chat_rooms)
      - `sender_id` (uuid, references users)
      - `message_type` (enum: text, price_offer, booking_update, system)
      - `content` (text)
      - `metadata` (jsonb) - for price offers, coordinates, etc.
      - `is_read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access chats they're part of
    - Only farmers and drivers can send messages
</sql>

-- Create enum for chat room status
CREATE TYPE chat_room_status_enum AS ENUM ('active', 'closed');

-- Create enum for message types
CREATE TYPE message_type_enum AS ENUM ('text', 'price_offer', 'booking_update', 'system');

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status chat_room_status_enum DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, farmer_id, driver_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type message_type_enum DEFAULT 'text',
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat rooms policies
CREATE POLICY "Users can view their chat rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::uuid = farmer_id 
    OR auth.uid()::uuid = driver_id
  );

CREATE POLICY "Users can create chat rooms"
  ON chat_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid()::uuid = farmer_id 
    OR auth.uid()::uuid = driver_id
  );

CREATE POLICY "Users can update their chat rooms"
  ON chat_rooms
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::uuid = farmer_id 
    OR auth.uid()::uuid = driver_id
  );

-- Chat messages policies
CREATE POLICY "Users can view messages in their rooms"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.farmer_id = auth.uid()::uuid OR chat_rooms.driver_id = auth.uid()::uuid)
    )
  );

CREATE POLICY "Users can send messages in their rooms"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.farmer_id = auth.uid()::uuid OR chat_rooms.driver_id = auth.uid()::uuid)
      AND chat_rooms.status = 'active'
    )
    AND auth.uid()::uuid = sender_id
  );

CREATE POLICY "Users can update their own messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::uuid = sender_id
    OR EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.farmer_id = auth.uid()::uuid OR chat_rooms.driver_id = auth.uid()::uuid)
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_rooms_booking_id ON chat_rooms(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_farmer_id ON chat_rooms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_driver_id ON chat_rooms(driver_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_status ON chat_rooms(status);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON chat_messages(is_read);

-- Function to update chat room timestamp
CREATE OR REPLACE FUNCTION update_chat_room_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_rooms 
  SET updated_at = now()
  WHERE id = NEW.room_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update room timestamp on new message
CREATE TRIGGER trigger_update_chat_room_timestamp
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_room_timestamp();