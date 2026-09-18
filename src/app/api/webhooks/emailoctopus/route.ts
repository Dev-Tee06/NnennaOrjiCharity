import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getAdminSupabase() {
  const cookieStore = await cookies();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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
    const payload = await request.json();
    
    // Validating webhook (In a real scenario we'd check signatures if EmailOctopus supports them)
    if (!payload || !payload.type || !payload.contact) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { type, contact } = payload;
    const { email_address, id, fields } = contact;

    const supabase = await getAdminSupabase();

    // The webhook might just inform us about a status change (e.g. unsubscribed)
    // We update Supabase if we want to sync the emailoctopus_contact_id or last_synced_at
    // But since we have multiple tables (donations, partnerships, company_enquiries) and we 
    // don't know which one this belongs to unless we check them all:

    const tables = ['donations', 'partnerships', 'company_enquiries'];

    for (const table of tables) {
      // Find if we have a record with this email
      const { data } = await supabase
        .from(table)
        .select('id')
        .eq('email', email_address)
        .limit(1);

      if (data && data.length > 0) {
        // Update the record with contact id and sync time
        await supabase
          .from(table)
          .update({
            emailoctopus_contact_id: id,
            last_synced_at: new Date().toISOString()
          })
          .eq('email', email_address);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
