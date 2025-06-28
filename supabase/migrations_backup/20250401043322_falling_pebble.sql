/*
  # Create CRM tables and security policies

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `source` (text)
      - `status` (text)
      - `assigned_to` (uuid, references profiles)
      - `last_contacted` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `course_type` (text)
      - `amount` (numeric)
      - `status` (text)
      - `payment_status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `activities`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `description` (text)
      - `created_at` (timestamp)

    - `follow_ups`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `user_id` (uuid, references profiles)
      - `scheduled_at` (timestamp)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  source text,
  status text DEFAULT 'new',
  assigned_to uuid REFERENCES profiles(id),
  last_contacted timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  course_type text NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  user_id uuid REFERENCES profiles(id),
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create follow_ups table
CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  user_id uuid REFERENCES profiles(id),
  scheduled_at timestamptz NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

-- Create policies for leads
CREATE POLICY "Assigned users can read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Assigned users can insert leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (assigned_to = auth.uid());

CREATE POLICY "Assigned users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid());

-- Create policies for orders
CREATE POLICY "Users can read related orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = orders.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can insert related orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can update related orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = orders.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

-- Create policies for activities
CREATE POLICY "Users can read related activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = activities.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can insert activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

-- Create policies for follow_ups
CREATE POLICY "Users can read related follow_ups"
  ON follow_ups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = follow_ups.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can insert follow_ups"
  ON follow_ups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can update related follow_ups"
  ON follow_ups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = follow_ups.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

-- Create function to update lead last_contacted
CREATE OR REPLACE FUNCTION update_lead_last_contacted()
RETURNS trigger AS $$
BEGIN
  UPDATE leads
  SET last_contacted = now(),
      updated_at = now()
  WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for activities
CREATE TRIGGER on_activity_created
  AFTER INSERT ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_last_contacted();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();