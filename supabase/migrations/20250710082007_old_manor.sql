/*
  # Create users table for AgriMove

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, optional, unique)
      - `phone` (text, unique, required)
      - `full_name` (text, required)
      - `password_hash` (text, required)
      - `user_type` (enum: farmer, driver, admin)
      - `is_verified` (boolean, default false)
      - `profile_image` (text, optional)
      - `service_areas` (text array, for drivers)
      - `rating` (numeric, for drivers)
      - `total_trips` (integer, for drivers)
      - `total_earnings` (numeric, for drivers)
      - `is_available` (boolean, for drivers)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policies for users to read/update their own data
    - Add policy for public registration
*/

-- Create enum for user types
CREATE TYPE user_type_enum AS ENUM ('farmer', 'driver', 'admin');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE NOT NULL,
  full_name text NOT NULL,
  password_hash text NOT NULL,
  user_type user_type_enum NOT NULL DEFAULT 'farmer',
  is_verified boolean DEFAULT false,
  profile_image text,
  service_areas text[] DEFAULT '{}',
  rating numeric(3,2) DEFAULT 0.0,
  total_trips integer DEFAULT 0,
  total_earnings numeric(12,2) DEFAULT 0.0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Enable insert for registration"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_available ON users(is_available) WHERE user_type = 'driver';