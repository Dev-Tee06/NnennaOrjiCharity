-- Fix notifications table schema
-- Ensure link_url column exists (it was missing from the live DB, causing the pledge insert trigger to fail)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link_url VARCHAR(255);

-- Ensure read_status column exists (used throughout the codebase; the original schema called it is_read)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_status BOOLEAN DEFAULT false;

-- Re-create the pledge assignment trigger so it also uses read_status instead of is_read,
-- and gracefully handles any future schema drift.
CREATE OR REPLACE FUNCTION assign_pledge_on_insert()
RETURNS TRIGGER AS $$
DECLARE
    default_coord_id UUID;
    is_eligible BOOLEAN;
    super_admin_id UUID;
BEGIN
    -- Find the designated default coordinator and check eligibility
    SELECT id, (status = 'Active' AND role IN ('admin', 'Super Admin'))
    INTO default_coord_id, is_eligible
    FROM profiles
    WHERE is_default_coordinator = true
    LIMIT 1;

    IF default_coord_id IS NOT NULL AND is_eligible THEN
        -- Assign to the eligible coordinator
        NEW.coordinator_id := default_coord_id;
        NEW.assignment_status := 'Assigned';
        NEW.assignment_source := 'Automatic';
        NEW.assigned_at := NOW();

        IF NEW.id IS NULL THEN
            NEW.id := gen_random_uuid();
        END IF;

        INSERT INTO notifications (user_id, title, message, type, link_url, read_status)
        VALUES (
            default_coord_id,
            'New Pledge Assigned',
            'A new pledge has been automatically assigned to you.',
            'PledgeAssignment',
            '/admin/donations',
            false
        );
    ELSE
        -- Leave unassigned
        NEW.assignment_status := 'Pending Assignment';
        NEW.coordinator_id := NULL;

        IF NEW.id IS NULL THEN
            NEW.id := gen_random_uuid();
        END IF;

        -- Notify Super Admin
        SELECT id INTO super_admin_id FROM profiles WHERE role = 'Super Admin' LIMIT 1;
        IF super_admin_id IS NULL THEN
            SELECT id INTO super_admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
        END IF;

        IF super_admin_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, link_url, read_status)
            VALUES (
                super_admin_id,
                'Pledge Assignment Failed',
                'A new pledge could not be assigned because no eligible default coordinator was found.',
                'AssignmentFailure',
                '/admin/donations',
                false
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach the trigger (function was replaced above)
DROP TRIGGER IF EXISTS pledge_assignment_trigger ON donations;
CREATE TRIGGER pledge_assignment_trigger
BEFORE INSERT ON donations
FOR EACH ROW
EXECUTE FUNCTION assign_pledge_on_insert();
