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
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await getSuperAdminClient();
    
    // Auth Check: Is the caller a Super Admin?
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

    const { data: callerProfile } = await supabase.from('profiles').select('role, status, is_role_coordinator, role_coordinator_quota').eq('id', user.id).single();
    if (!callerProfile || callerProfile.status !== 'Active') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const isSuperAdmin = callerProfile.role === 'Super Admin';
    const isRoleCoordinator = callerProfile.is_role_coordinator;

    if (!isSuperAdmin && !isRoleCoordinator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse Body
    const body = await request.json();
    const { email, fullName, role, permissions, custom_role_id } = body;

    if (!isSuperAdmin && isRoleCoordinator) {
      if (callerProfile.role_coordinator_quota <= 0) {
        return NextResponse.json({ error: 'Role coordinator quota exceeded' }, { status: 403 });
      }
      if (role === 'Super Admin') {
        return NextResponse.json({ error: 'Role Coordinators cannot assign Super Admin role' }, { status: 403 });
      }
    }

    // 1. Check if user already exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', email)
      .single();

    let targetUserId = '';
    let isNewUser = false;

    if (existingProfile) {
      targetUserId = existingProfile.id;
      // Prevent role coordinator from overwriting an existing Super Admin
      if (!isSuperAdmin && existingProfile.role === 'Super Admin') {
        return NextResponse.json({ error: 'Cannot modify an existing Super Admin account' }, { status: 403 });
      }
      
      // We don't need to invite them, but we should generate a password reset link 
      // so they can set a password if they only ever used magic links, but for now we just upgrade their profile.
      await supabase.auth.admin.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/onboarding`
      });
    } else {
      // Invite User via Supabase Auth
      const { data: authData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/onboarding`,
        data: { full_name: fullName }
      });

      if (inviteError) {
        // Fallback: If invite fails because user exists in Auth but not in profiles table
        if (inviteError.message.includes('already been registered')) {
          const { data: users } = await supabase.auth.admin.listUsers();
          const foundUser = users.users.find(u => u.email === email);
          if (foundUser) {
            targetUserId = foundUser.id;
            await supabase.auth.admin.resetPasswordForEmail(email, {
              redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/onboarding`
            });
          } else {
            return NextResponse.json({ error: 'User exists but could not be located.' }, { status: 400 });
          }
        } else {
          return NextResponse.json({ error: inviteError.message }, { status: 400 });
        }
      } else {
        targetUserId = authData.user.id;
        isNewUser = true;
      }
    }

    // 2. Create Profile
    await supabase.from('profiles').upsert({
      id: targetUserId,
      email: email,
      full_name: fullName,
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
    // We only deduct if they are inviting a NEW user, or you can deduct for upgrades too. 
    // Let's deduct for any assignment by a coordinator.
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
      details: { email, role, custom_role_id, was_existing_user: !isNewUser }
    });

    // 5. Notify Caller
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Admin Invitation Sent',
      message: isNewUser 
        ? `An invitation was successfully sent to ${email}.`
        : `The existing account for ${email} was successfully upgraded to Admin. A password reset link has been emailed to them.`,
      type: 'AdminManagement',
      link_url: '/admin/roles'
    });

    return NextResponse.json({ success: true, userId: targetUserId });
  } catch (error: any) {
    console.error('Invite Admin Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
