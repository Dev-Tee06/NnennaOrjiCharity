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
    const { firstName, lastName, email, phone, message, location, donationType } = body;

    // Validate: require a name and at least one contact method (email or phone)
    if (!firstName) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    if (!email && !phone) {
      return NextResponse.json({ error: 'Either an email address or phone number is required' }, { status: 400 });
    }

    const supabase = await getAdminSupabase();

    // Find the eligible default coordinator
    const { data: defaultCoord, error: coordError } = await supabase
      .from('profiles')
      .select('id, role, status')
      .eq('is_default_coordinator', true)
      .eq('status', 'Active')
      .single();
      
    const isEligible = defaultCoord && (defaultCoord.role === 'admin' || defaultCoord.role === 'Super Admin');
    const coordinatorId = isEligible ? defaultCoord.id : null;
    const assignmentStatus = isEligible ? 'Assigned' : 'Pending Assignment';
    const assignmentSource = isEligible ? 'Automatic' : null;
    const assignedAt = isEligible ? new Date().toISOString() : null;

    // 1. Save to Supabase (Operational Record)
    const { data: insertedDonation, error } = await supabase
      .from('donations')
      .insert({
        first_name: firstName,
        last_name: lastName || null,
        email: email,
        phone: phone || null,
        message: message || null,
        donation_type: donationType || null,
        notes: location ? `Location: ${location}` : null,
        status: 'Pending',
        coordinator_id: coordinatorId,
        assignment_status: assignmentStatus,
        assignment_source: assignmentSource,
        assigned_at: assignedAt
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error (donations):', error);
      return NextResponse.json({ error: 'Failed to process donation', details: error.message }, { status: 500 });
    }

    // 2. Handle Notifications
    if (isEligible && coordinatorId) {
       await supabase.from('notifications').insert({
         user_id: coordinatorId,
         title: 'New Pledge Assigned',
         message: 'A new pledge has been automatically assigned to you.',
         type: 'PledgeAssignment',
         link_url: '/admin/donations'
       });
    } else {
       // Notify Super Admin of assignment failure
       const { data: superAdmin } = await supabase
         .from('profiles')
         .select('id')
         .eq('role', 'Super Admin')
         .eq('status', 'Active')
         .limit(1)
         .single();
         
       if (superAdmin) {
         await supabase.from('notifications').insert({
           user_id: superAdmin.id,
           title: 'Pledge Assignment Failed',
           message: `A new pledge (ID: ${insertedDonation?.id}) could not be assigned because no eligible default coordinator was found.`,
           type: 'AssignmentFailure',
           link_url: '/admin/donations'
         });
       }
    }

    // 2. Save to EmailOctopus (only when email provided; wrapped in own try/catch so
    //    a network error never blocks the pledge from being recorded)
    if (email) {
      try {
        const contact = await addDonorContact(email, {
          FirstName: firstName,
          LastName: lastName || undefined,
          Phone: phone || undefined,
          ContactType: 'Donation',
          Message: message || undefined,
        });
        if (!contact) {
          console.error('EmailOctopus: contact was not created for', email);
        }
      } catch (eoErr) {
        console.error('EmailOctopus integration error (non-fatal):', eoErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Donations API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
