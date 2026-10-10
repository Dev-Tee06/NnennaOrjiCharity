CREATE TABLE IF NOT EXISTS foundation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email text,
  support_phone text,
  hq_address text,
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text UNIQUE,
  subject text,
  body text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert defaults for foundation settings
INSERT INTO foundation_settings (contact_email, support_phone, hq_address)
VALUES ('admin@nocf.org.ng', '+234 810 000 0000', '12, Adeniyi Jones Avenue, Ikeja, Lagos, Nigeria.')
ON CONFLICT DO NOTHING;

-- Insert defaults for email templates
INSERT INTO email_templates (category, subject, body) VALUES
('Pledge Received', 'NOCF: Pledge Received. Thank you for your contribution!', 'Dear {Donor_Name},

Thank you for choosing to help out the Nnenna Orji Charity Foundation in this box. We have received your pledge...

Best regards,
The NOCF Project Team.'),
('Pickup Scheduled', 'NOCF: Pickup Scheduled for your Pledge', 'Dear {Donor_Name},

Your pickup has been scheduled.
Tracking: {Tracking_Number}

Best,'),
('Item Received', 'NOCF: Item Received', 'Dear {Donor_Name},

We have received your item. Thank you!

Best,'),
('Pledge Cancelled', 'NOCF: Pledge Cancelled', 'Dear {Donor_Name},

Your pledge has been cancelled.

Best,')
ON CONFLICT (category) DO NOTHING;

-- Enable RLS
ALTER TABLE foundation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view
CREATE POLICY "Allow authenticated to view settings" ON foundation_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to view templates" ON email_templates FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admins (authenticated) to update
CREATE POLICY "Allow authenticated to update settings" ON foundation_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to update templates" ON email_templates FOR UPDATE USING (auth.role() = 'authenticated');
