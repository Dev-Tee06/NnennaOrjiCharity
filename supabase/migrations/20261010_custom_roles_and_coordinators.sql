-- Custom Roles Table
CREATE TABLE IF NOT EXISTS custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Custom Role Permissions Table
CREATE TABLE IF NOT EXISTS custom_role_permissions (
    role_id UUID REFERENCES custom_roles(id) ON DELETE CASCADE,
    module VARCHAR(50) NOT NULL,
    can_view BOOLEAN DEFAULT false,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    PRIMARY KEY (role_id, module)
);

-- Add fields to profiles for Role Coordinator functionality and custom role linking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_role_id UUID REFERENCES custom_roles(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_role_coordinator BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_coordinator_quota INTEGER DEFAULT 0;

-- RLS for custom_roles
ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view custom roles" ON custom_roles;
CREATE POLICY "Anyone can view custom roles" ON custom_roles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Super Admins can insert custom roles" ON custom_roles;
CREATE POLICY "Super Admins can insert custom roles" ON custom_roles FOR INSERT WITH CHECK (auth_is_super_admin());

DROP POLICY IF EXISTS "Super Admins can update custom roles" ON custom_roles;
CREATE POLICY "Super Admins can update custom roles" ON custom_roles FOR UPDATE USING (auth_is_super_admin());

DROP POLICY IF EXISTS "Super Admins can delete custom roles" ON custom_roles;
CREATE POLICY "Super Admins can delete custom roles" ON custom_roles FOR DELETE USING (auth_is_super_admin());

-- RLS for custom_role_permissions
ALTER TABLE custom_role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view custom role permissions" ON custom_role_permissions;
CREATE POLICY "Anyone can view custom role permissions" ON custom_role_permissions FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Super Admins can manage custom role permissions" ON custom_role_permissions;
CREATE POLICY "Super Admins can manage custom role permissions" ON custom_role_permissions USING (auth_is_super_admin());

-- Insert a default Operations Lead role to start
INSERT INTO custom_roles (name, description) VALUES ('Operations Lead', 'Manages daily operational tasks and donations.') ON CONFLICT (name) DO NOTHING;
