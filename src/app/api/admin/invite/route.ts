import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSuperAdminClient() {
  const cookieStore = await cookies();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await getSuperAdminClient();
    
    // Auth Check: Is the caller a Super Admin or authorized Role Coordinator?
    const cookieStore = await cookies();
    const userClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role, status, is_role_coordinator, role_coordinator_quota')
      .eq('id', user.id)
      .single();

    if (!callerProfile || callerProfile.status !== 'Active') {
      return NextResponse.json({ error: 'Forbidden: caller is inactive or not found' }, { status: 403 });
    }

    const isSuperAdmin = callerProfile.role === 'Super Admin';
    const isRoleCoordinator = callerProfile.is_role_coordinator;

    if (!isSuperAdmin && !isRoleCoordinator) {
      return NextResponse.json({ error: 'Forbidden: Only Super Admins can manage invitations' }, { status: 403 });
    }

    const body = await request.json();
    const { action, email, fullName, role, permissions, custom_role_id } = body;

    const requestOrigin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectTo = `${requestOrigin}/admin/onboarding`;

    // RESEND ACTION
    if (action === 'resend') {
      if (!email || !email.trim()) {
        return NextResponse.json({ error: 'Email address is required to resend invitation.' }, { status: 400 });
      }

      const cleanTargetEmail = email.trim().toLowerCase();

      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('id, full_name, onboarding_status, status, role, custom_role_id')
        .eq('email', cleanTargetEmail)
        .single();

      if (!targetProfile) {
        return NextResponse.json({ error: 'No administrator profile found for this email address.' }, { status: 404 });
      }

      if (targetProfile.onboarding_status === 'Completed' && targetProfile.status === 'Active') {
        return NextResponse.json({
          error: 'This administrator has already completed onboarding.'
        }, { status: 400 });
      }

      // Preserve existing permissions
      const { data: existingPerms } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('profile_id', targetProfile.id);

      // Clean up previous uncompleted auth user so Supabase sends a fresh invitation email
      try {
        await supabase.auth.admin.deleteUser(targetProfile.id);
      } catch (delErr) {
        console.warn('Could not delete stale auth user, continuing with invite:', delErr);
      }

      // Send authentic invitation email
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(cleanTargetEmail, {
        redirectTo,
        data: { full_name: targetProfile.full_name }
      });

      if (inviteError) {
        return NextResponse.json({ error: inviteError.message }, { status: 400 });
      }

      const newUserId = inviteData.user.id;

      // Re-create profile with new auth user ID
      await supabase.from('profiles').upsert({
        id: newUserId,
        email: cleanTargetEmail,
        full_name: targetProfile.full_name,
        role: targetProfile.role,
        custom_role_id: targetProfile.custom_role_id || null,
        status: 'Active',
        onboarding_status: 'Pending Setup'
      });

      // Re-attach permissions
      if (existingPerms && existingPerms.length > 0) {
        const permsToInsert = existingPerms.map(p => ({
          profile_id: newUserId,
          module: p.module,
          can_view: p.can_view,
          can_create: p.can_create,
          can_edit: p.can_edit,
          can_delete: p.can_delete
        }));
        await supabase.from('admin_permissions').upsert(permsToInsert, { onConflict: 'profile_id,module' });
      }

      // Audit Log
      await supabase.from('admin_activity_logs').insert({
        actor_id: user.id,
        action: 'RESEND_INVITE_ADMIN',
        resource: newUserId,
        details: { email: cleanTargetEmail }
      });

      return NextResponse.json({ success: true, message: 'Admin invitation resent successfully.' });
    }

    // CREATE INVITATION ACTION
    // Input Validations
    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'Full Name is required.' }, { status: 400 });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    // Enforce permitted admin roles per PRD Section 4.2 Step 2
    if (role !== 'Super Admin' && role !== 'Standard Admin') {
      return NextResponse.json({ error: 'Role must be either Super Admin or Standard Admin.' }, { status: 400 });
    }

    if (!isSuperAdmin && isRoleCoordinator) {
      if (callerProfile.role_coordinator_quota <= 0) {
        return NextResponse.json({ error: 'Role coordinator quota exceeded.' }, { status: 403 });
      }
      if (role === 'Super Admin') {
        return NextResponse.json({ error: 'Role Coordinators cannot assign Super Admin role.' }, { status: 403 });
      }
    }

    // 1. Check if user already exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, role, status, onboarding_status')
      .eq('email', cleanEmail)
      .single();

    let targetUserId = '';
    const isNewUser = !existingProfile;

    if (existingProfile) {
      if (existingProfile.onboarding_status === 'Completed') {
        return NextResponse.json({
          error: 'An active administrator account with this email already exists.'
        }, { status: 400 });
      }

      // User exists with pending setup: clean up stale auth user and send a fresh invite
      try {
        await supabase.auth.admin.deleteUser(existingProfile.id);
      } catch (delErr) {
        console.warn('Could not delete uncompleted auth user:', delErr);
      }
    }

    // Invite User via Supabase Auth Administrative API
    const { data: authData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(cleanEmail, {
      redirectTo,
      data: { full_name: fullName.trim() }
    });

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }

    targetUserId = authData.user.id;

    // 2. Create or Update Profile with Pending Setup status
    await supabase.from('profiles').upsert({
      id: targetUserId,
      email: cleanEmail,
      full_name: fullName.trim(),
      role: role,
      custom_role_id: custom_role_id || null,
      status: 'Pending Setup',
      onboarding_status: 'Pending Setup'
    });

    // 3. Insert Permissions
    if (permissions && Array.isArray(permissions) && !custom_role_id) {
      const permsToInsert = permissions.map(p => ({
        profile_id: targetUserId,
        module: p.module,
        can_view: p.can_view || false,
        can_create: p.can_create || false,
        can_edit: p.can_edit || false,
        can_delete: p.can_delete || false
      }));
      await supabase.from('admin_permissions').upsert(permsToInsert, { onConflict: 'profile_id,module' });
    }

    // Deduct quota if not super admin but is role coordinator
    if (!isSuperAdmin && isRoleCoordinator) {
      await supabase.from('profiles')
        .update({ role_coordinator_quota: callerProfile.role_coordinator_quota - 1 })
        .eq('id', user.id);
    }

    // 4. Audit Log
    await supabase.from('admin_activity_logs').insert({
      actor_id: user.id,
      action: 'INVITE_ADMIN',
      resource: targetUserId,
      details: { email: cleanEmail, role, custom_role_id, was_existing_user: !isNewUser }
    });

    // 5. Notify Caller
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Admin Invitation Sent',
      message: isNewUser 
        ? `An invitation was successfully sent to ${cleanEmail}.`
        : `The account for ${cleanEmail} was updated. An onboarding link has been sent.`,
      type: 'AdminManagement',
      link_url: '/admin/roles'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin invitation sent successfully.',
      userId: targetUserId 
    });
  } catch (error: unknown) {
    console.error('Invite Admin Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


