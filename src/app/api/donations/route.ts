import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addDonorContact } from '@/lib/emailoctopus/contacts';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper to get service role client if available, else anon
async function getAdminSupabase() {
  const cookieStore = await cookies();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // Read-only cookies for admin
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Validate
    if (!firstName || !email) {
      return NextResponse.json({ error: 'First name and email are required' }, { status: 400 });
    }

    const supabase = await getAdminSupabase();

    // 1. Save to Supabase (Operational Record)
    const { error } = await supabase
      .from('donations')
      .insert({
        first_name: firstName,
        last_name: lastName || null,
        email: email,
        phone: phone || null,
        message: message || null,
        status: 'Pending'
      });

    if (error) {
      console.error('Supabase insert error (donations):', error);
      return NextResponse.json({ error: 'Failed to process donation', details: error.message }, { status: 500 });
    }

    // 2. Save to EmailOctopus
    const contact = await addDonorContact(email, {
      FirstName: firstName,
      LastName: lastName || undefined,
      Phone: phone || undefined,
      ContactType: 'Donation',
      Message: message || undefined,
    });

    if (!contact) {
      console.error('EmailOctopus integration failed for donation email:', email);
      // We don't fail the request if EO fails, but we might want to flag it in a real app
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Donations API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
