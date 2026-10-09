-- 1. Administrative Permissions Table
CREATE TABLE IF NOT EXISTS admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    module VARCHAR(100) NOT NULL,
    can_view BOOLEAN DEFAULT false,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, module)
);

-- 2. Administrative Activity Logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id SERIAL PRIMARY KEY,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Extend Profiles for Onboarding and Suspension
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(50) DEFAULT 'Pending Setup';
-- Assuming status already exists as 'Active' / 'Suspended' / 'Revoked'

-- Enable RLS
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper Functions to prevent infinite recursion in RLS
CREATE OR REPLACE FUNCTION auth_is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'Super Admin' 
        AND status = 'Active'
    );
$$;

CREATE OR REPLACE FUNCTION auth_is_active_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND status = 'Active'
    );
$$;

-- 4. RLS Policies for Permissions
DROP POLICY IF EXISTS "Admins can view their own permissions" ON admin_permissions;
CREATE POLICY "Admins can view their own permissions" ON admin_permissions
    FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Super Admins can manage all permissions" ON admin_permissions;
CREATE POLICY "Super Admins can manage all permissions" ON admin_permissions
    FOR ALL USING (auth_is_super_admin());

-- 5. RLS Policies for Activity Logs
DROP POLICY IF EXISTS "Super Admins can view activity logs" ON admin_activity_logs;
CREATE POLICY "Super Admins can view activity logs" ON admin_activity_logs
    FOR SELECT USING (auth_is_super_admin());

-- 6. RLS Policies for Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (auth_is_active_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super Admins can update any profile" ON profiles;
CREATE POLICY "Super Admins can update any profile" ON profiles
    FOR UPDATE USING (auth_is_super_admin());
