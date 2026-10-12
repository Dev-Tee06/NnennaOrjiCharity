import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getAdminClient() {
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
    const cookieStore = await cookies();
    const userClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {}
        }
      }
    );

    const body = await request.json();
    const { userId, action } = body;

    const supabaseAdmin = await getAdminClient();

    // 1. If called by Super Admin from /admin/roles to reset an administrator's 2FA
    if (action === 'admin_reset') {
      const { data: { user: caller } } = await userClient.auth.getUser();
      if (!caller) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data: callerProfile } = await supabaseAdmin
        .from('profiles')
        .select('role, status')
        .eq('id', caller.id)
        .single();

      if (!callerProfile || callerProfile.role !== 'Super Admin' || callerProfile.status !== 'Active') {
        return NextResponse.json({ error: 'Only active Super Admins can reset 2FA factors.' }, { status: 403 });
      }

      if (!userId) {
        return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 });
      }

      // Fetch factors for target user
      const { data: factorsData, error: listErr } = await supabaseAdmin.auth.admin.mfa.listFactors({ userId });
      if (listErr) throw listErr;

      const factors = factorsData?.factors || [];
      for (const factor of factors) {
        await supabaseAdmin.auth.admin.mfa.deleteFactor({ userId, id: factor.id });
      }

      // Audit log
      await supabaseAdmin.from('admin_activity_logs').insert({
        actor_id: caller.id,
        action: 'RESET_ADMIN_MFA',
        resource: userId,
        details: { target_user_id: userId }
      });

      return NextResponse.json({
        success: true,
        message: 'Authenticator factors have been reset. The user can scan a new QR code on next login.'
      });
    }

    // 2. If called during login when an admin has verified their password but needs to pair a new authenticator QR code
    if (action === 'self_reset') {
      const { data: { user } } = await userClient.auth.getUser();
      
      // If no session in cookie, verify using the provided userId from the active login attempt
      const targetId = user?.id || userId;
      if (!targetId) {
        return NextResponse.json({ error: 'User identification required to reset authenticator.' }, { status: 400 });
      }

      // Fetch target user profile
      const { data: targetProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, email, status')
        .eq('id', targetId)
        .single();

      if (!targetProfile || targetProfile.status !== 'Active') {
        return NextResponse.json({ error: 'Account not active or not found.' }, { status: 403 });
      }

      // Delete existing factors so a fresh QR code can be generated
      const { data: factorsData, error: listErr } = await supabaseAdmin.auth.admin.mfa.listFactors({ userId: targetId });
      if (listErr) throw listErr;

      const factors = factorsData?.factors || [];
      for (const factor of factors) {
        await supabaseAdmin.auth.admin.mfa.deleteFactor({ userId: targetId, id: factor.id });
      }

      // Log the reset
      await supabaseAdmin.from('admin_activity_logs').insert({
        actor_id: targetId,
        action: 'SELF_RESET_MFA_LOGIN',
        resource: targetId,
        details: { email: targetProfile.email }
      });

      return NextResponse.json({
        success: true,
        message: 'Authenticator reset successfully. Please scan your new QR code.'
      });
    }

    return NextResponse.json({ error: 'Invalid action specified.' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to reset MFA factor.' }, { status: 500 });
  }
}
