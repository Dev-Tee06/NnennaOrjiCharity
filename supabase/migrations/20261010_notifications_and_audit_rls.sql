-- Notifications RLS
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;
CREATE POLICY "Authenticated users can create notifications" ON notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Admin Activity Logs RLS
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON admin_activity_logs;
CREATE POLICY "Authenticated users can insert activity logs" ON admin_activity_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
