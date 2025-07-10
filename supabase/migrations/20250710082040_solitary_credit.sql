/*
  # Create booking ratings table for AgriMove

  1. New Tables
    - `booking_ratings`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings)
      - `farmer_id` (uuid, foreign key to users)
      - `driver_id` (uuid, foreign key to users)
      - `rating` (integer, 1-5)
      - `comment` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `booking_ratings` table
    - Add policies for farmers to rate completed bookings
    - Add policies for drivers to view their ratings
*/

-- Create booking ratings table
CREATE TABLE IF NOT EXISTS booking_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, farmer_id)
);

-- Enable RLS
ALTER TABLE booking_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Farmers can rate completed bookings"
  ON booking_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::uuid 
      AND users.id = booking_ratings.farmer_id
      AND users.user_type = 'farmer'
    )
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_ratings.booking_id
      AND bookings.farmer_id = booking_ratings.farmer_id
      AND bookings.driver_id = booking_ratings.driver_id
      AND bookings.status = 'delivered'
    )
  );

CREATE POLICY "Users can view ratings they're involved in"
  ON booking_ratings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::uuid = farmer_id 
    OR auth.uid()::uuid = driver_id
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_booking_ratings_booking_id ON booking_ratings(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_ratings_farmer_id ON booking_ratings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_booking_ratings_driver_id ON booking_ratings(driver_id);
CREATE INDEX IF NOT EXISTS idx_booking_ratings_rating ON booking_ratings(rating);

-- Create function to update driver rating
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET 
    rating = (
      SELECT AVG(rating)::numeric(3,2) 
      FROM booking_ratings 
      WHERE driver_id = NEW.driver_id
    ),
    updated_at = now()
  WHERE id = NEW.driver_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update driver rating
CREATE TRIGGER trigger_update_driver_rating
  AFTER INSERT ON booking_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_rating();