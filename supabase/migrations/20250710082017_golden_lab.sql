/*
  # Create vehicles table for AgriMove

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `driver_id` (uuid, foreign key to users)
      - `vehicle_type` (enum: pickup, truck, van, motorcycle, tractor)
      - `make` (text, required)
      - `model` (text, required)
      - `year` (integer, required)
      - `plate_number` (text, unique, required)
      - `capacity` (numeric, in tons)
      - `specialization` (text, optional)
      - `rate_per_km` (numeric, required)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `vehicles` table
    - Add policies for drivers to manage their vehicles
    - Add policy for public to view active vehicles
*/

-- Create enum for vehicle types
CREATE TYPE vehicle_type_enum AS ENUM ('pickup', 'truck', 'van', 'motorcycle', 'tractor');

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type vehicle_type_enum NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  plate_number text UNIQUE NOT NULL,
  capacity numeric(5,2) NOT NULL CHECK (capacity > 0),
  specialization text,
  rate_per_km numeric(8,2) NOT NULL CHECK (rate_per_km > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Drivers can manage own vehicles"
  ON vehicles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::uuid 
      AND users.id = vehicles.driver_id
      AND users.user_type = 'driver'
    )
  );

CREATE POLICY "Public can view active vehicles"
  ON vehicles
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_active ON vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_capacity ON vehicles(capacity);
CREATE INDEX IF NOT EXISTS idx_vehicles_rate ON vehicles(rate_per_km);