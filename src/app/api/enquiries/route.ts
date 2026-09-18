import { NextResponse } from 'next/server';
import { addEnquiryContact } from '@/lib/emailoctopus/contacts';
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
    const { companyName, contactName, email, phone, message } = body;

    if (!contactName || !email) {
      return NextResponse.json({ error: 'Contact name and email are required' }, { status: 400 });
    }

    const supabase = await getAdminSupabase();

    // 1. Save to Supabase (Operational Record)
    const { error } = await supabase
      .from('company_enquiries')
      .insert({
        company_name: companyName || null,
        contact_name: contactName,
        email: email,
        phone: phone || null,
        message: message || null,
        status: 'New'
      });

    if (error) {
      console.error('Supabase insert error (enquiries):', error);
      return NextResponse.json({ error: 'Failed to process enquiry', details: error.message }, { status: 500 });
    }

    // Split contact name for EmailOctopus
    const [firstName, ...lastNameParts] = contactName.split(' ');
    const lastName = lastNameParts.join(' ');

    // 2. Save to EmailOctopus
    const contact = await addEnquiryContact(email, {
      FirstName: firstName,
      LastName: lastName || undefined,
      Organisation: companyName || undefined,
      Phone: phone || undefined,
      ContactType: 'Enquiry',
      Message: message || undefined,
    });

    if (!contact) {
      console.error('EmailOctopus integration failed for enquiry email:', email);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Enquiries API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
