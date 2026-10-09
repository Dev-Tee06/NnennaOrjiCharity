-- 1. Remove the unique constraint so multiple default coordinators can exist
DROP INDEX IF EXISTS one_default_coordinator;

-- 2. Update the trigger to load-balance pledges among all eligible default coordinators
CREATE OR REPLACE FUNCTION assign_pledge_on_insert()
RETURNS TRIGGER AS $$
DECLARE
    selected_coord_id UUID;
    super_admin_id UUID;
BEGIN
    -- Find an eligible default coordinator who currently has the fewest assigned pledges
    SELECT p.id
    INTO selected_coord_id
    FROM profiles p
    LEFT JOIN donations d ON d.coordinator_id = p.id AND d.assignment_status = 'Assigned'
    WHERE p.is_default_coordinator = true 
      AND p.status = 'Active' 
      AND p.role IN ('admin', 'Super Admin')
    GROUP BY p.id
    ORDER BY COUNT(d.id) ASC
    LIMIT 1;

    IF selected_coord_id IS NOT NULL THEN
        -- Assign to the selected coordinator
        NEW.coordinator_id := selected_coord_id;
        NEW.assignment_status := 'Assigned';
        NEW.assignment_source := 'Automatic';
        NEW.assigned_at := NOW();
        
        IF NEW.id IS NULL THEN
            NEW.id := gen_random_uuid();
        END IF;
        
        INSERT INTO notifications (user_id, title, message, type, link_url)
        VALUES (selected_coord_id, 'New Pledge Assigned', 'A new pledge has been automatically assigned to you.', 'PledgeAssignment', '/admin/donations');
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
            INSERT INTO notifications (user_id, title, message, type, link_url)
            VALUES (super_admin_id, 'Pledge Assignment Failed', 'A new pledge could not be assigned because no eligible default coordinator was found.', 'AssignmentFailure', '/admin/donations');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
