-- Trigger for Enquiries
CREATE OR REPLACE FUNCTION notify_all_admins_on_enquiry()
RETURNS TRIGGER AS $$
DECLARE
    admin RECORD;
BEGIN
    FOR admin IN (SELECT id FROM profiles WHERE status = 'Active') LOOP
        INSERT INTO notifications (user_id, title, message, type, link_url)
        VALUES (
            admin.id, 
            'New Enquiry Received', 
            'A new enquiry was submitted by ' || NEW.contact_name || ' (' || NEW.email || ').', 
            'System', 
            '/admin/requests'
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_enquiry_insert ON company_enquiries;
CREATE TRIGGER on_enquiry_insert
AFTER INSERT ON company_enquiries
FOR EACH ROW EXECUTE FUNCTION notify_all_admins_on_enquiry();

-- Trigger for Donations/Pledges
CREATE OR REPLACE FUNCTION notify_all_admins_on_donation()
RETURNS TRIGGER AS $$
DECLARE
    admin RECORD;
BEGIN
    FOR admin IN (SELECT id FROM profiles WHERE status = 'Active') LOOP
        -- Send a general notification to everyone except the assigned coordinator (who already gets a specific one from the other trigger)
        IF NEW.coordinator_id IS NULL OR admin.id != NEW.coordinator_id THEN
            INSERT INTO notifications (user_id, title, message, type, link_url)
            VALUES (
                admin.id, 
                'New Pledge Submitted', 
                'A new pledge was submitted by ' || NEW.first_name || ' ' || COALESCE(NEW.last_name, '') || '.', 
                'System', 
                '/admin/donations'
            );
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_donation_insert ON donations;
CREATE TRIGGER on_donation_insert
AFTER INSERT ON donations
FOR EACH ROW EXECUTE FUNCTION notify_all_admins_on_donation();

-- Trigger for Partnerships
CREATE OR REPLACE FUNCTION notify_all_admins_on_partnership()
RETURNS TRIGGER AS $$
DECLARE
    admin RECORD;
BEGIN
    FOR admin IN (SELECT id FROM profiles WHERE status = 'Active') LOOP
        INSERT INTO notifications (user_id, title, message, type, link_url)
        VALUES (
            admin.id, 
            'New Partnership Request', 
            'A new partnership request was submitted by ' || NEW.first_name || ' ' || COALESCE(NEW.last_name, '') || '.', 
            'System', 
            '/admin/requests'
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_partnership_insert ON partnerships;
CREATE TRIGGER on_partnership_insert
AFTER INSERT ON partnerships
FOR EACH ROW EXECUTE FUNCTION notify_all_admins_on_partnership();
