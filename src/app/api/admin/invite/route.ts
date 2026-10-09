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

    const { data: callerProfile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single();
    if (!callerProfile || callerProfile.role !== 'Super Admin' || callerProfile.status !== 'Active') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse Body
    const body = await request.json();
    const { email, fullName, role, permissions } = body;

    // 1. Invite User via Supabase Auth
    const { data: authData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/onboarding`,
      data: { full_name: fullName }
    });

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }

    const newUserId = authData.user.id;

    // 2. Create Profile
    await supabase.from('profiles').upsert({
      id: newUserId,
      email: email,
      full_name: fullName,
      role: role,
      status: 'Pending Setup',
      onboarding_status: 'Pending Setup'
    });

    // 3. Insert Permissions
    if (permissions && Array.isArray(permissions)) {
      const permsToInsert = permissions.map(p => ({
        profile_id: newUserId,
        module: p.module,
        can_view: p.can_view || false,
        can_create: p.can_create || false,
        can_edit: p.can_edit || false,
        can_delete: p.can_delete || false
      }));
      await supabase.from('admin_permissions').insert(permsToInsert);
    }

    // 4. Audit Log
    await supabase.from('admin_activity_logs').insert({
      actor_id: user.id,
      action: 'INVITE_ADMIN',
      resource: newUserId,
      details: { email, role }
    });

    // 5. Notify Caller
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Admin Invitation Sent',
      message: `An invitation was successfully sent to ${email}.`,
      type: 'AdminManagement',
      link_url: '/admin/roles'
    });

    return NextResponse.json({ success: true, userId: newUserId });
  } catch (error: any) {
    console.error('Invite Admin Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
