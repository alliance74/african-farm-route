/*
  # Create bookings table for AgriMove

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, foreign key to users)
      - `driver_id` (uuid, foreign key to users, nullable)
      - `vehicle_id` (uuid, foreign key to vehicles, nullable)
      - `pickup_location` (text, required)
      - `delivery_location` (text, required)
      - `pickup_coordinates` (jsonb, optional)
      - `delivery_coordinates` (jsonb, optional)
      - `goods_type` (text, required)
      - `goods_weight` (numeric, required)
      - `scheduled_date` (date, required)
      - `scheduled_time` (time, required)
      - `status` (enum: pending, confirmed, in_transit, delivered, cancelled)
      - `price` (numeric, required)
      - `distance_km` (numeric, optional)
      - `special_instructions` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for farmers and drivers to access relevant bookings
*/

-- Create enum for booking status
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  pickup_location text NOT NULL,
  delivery_location text NOT NULL,
  pickup_coordinates jsonb,
  delivery_coordinates jsonb,
  goods_type text NOT NULL,
  goods_weight numeric(8,2) NOT NULL CHECK (goods_weight > 0),
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  status booking_status_enum DEFAULT 'pending',
  price numeric(10,2) DEFAULT 0,
  distance_km numeric(8,2),
  special_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Farmers can manage own bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::uuid 
      AND users.id = bookings.farmer_id
      AND users.user_type = 'farmer'
    )
  );

CREATE POLICY "Drivers can view assigned bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::uuid 
      AND users.id = bookings.driver_id
      AND users.user_type = 'driver'
    )
  );

CREATE POLICY "Drivers can view pending bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    status = 'pending' 
    AND driver_id IS NULL
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::uuid 
      AND users.user_type = 'driver'
    )
  );

CREATE POLICY "Drivers can update assigned bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::uuid 
      AND users.id = bookings.driver_id
      AND users.user_type = 'driver'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_farmer_id ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_pending ON bookings(status) WHERE status = 'pending';