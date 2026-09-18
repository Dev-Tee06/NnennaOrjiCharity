import { NextResponse } from 'next/server';
import { addPartnerContact } from '@/lib/emailoctopus/contacts';
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
    const body = await request.json();
    const { firstName, lastName, email, phone, organisation, message } = body;

    if (!firstName || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const supabase = await getAdminSupabase();

    // 1. Save to Supabase (Operational Record)
    const { error } = await supabase
      .from('partnerships')
      .insert({
        first_name: firstName,
        last_name: lastName || null,
        email: email,
        phone: phone || null,
        organisation: organisation || null,
        message: message || null,
        status: 'New'
      });

    if (error) {
      console.error('Supabase insert error (partnerships):', error);
      return NextResponse.json({ error: 'Failed to process partnership request', details: error.message }, { status: 500 });
    }

    // 2. Save to EmailOctopus
    const contact = await addPartnerContact(email, {
      FirstName: firstName,
      LastName: lastName || undefined,
      Phone: phone || undefined,
      Organisation: organisation || undefined,
      ContactType: 'Partnership',
      Message: message || undefined,
    });

    if (!contact) {
      console.error('EmailOctopus integration failed for partnership email:', email);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Partnerships API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
