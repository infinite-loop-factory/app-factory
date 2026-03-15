CREATE TABLE IF NOT EXISTS visa_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  country_code text NOT NULL,
  max_days integer NOT NULL DEFAULT 90,
  alert_days_before integer NOT NULL DEFAULT 7,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, country_code)
);

ALTER TABLE visa_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own visa limits" ON visa_limits
  FOR ALL USING (auth.uid() = user_id);
