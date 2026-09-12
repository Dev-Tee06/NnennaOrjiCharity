import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jzxybtxdszwrllllaote.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eHlidHhkc3p3cmxsbGxhb3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTQ1NDYsImV4cCI6MjEwNDc5MDU0Nn0.HXOzCeEs0fAXhNtIULx5JOjRYzt6cWPew4F9-3f4y40';
const supabase = createClient(supabaseUrl, supabaseKey);

const requests = [
  {
    company_name: 'Dangote Group',
    contact_name: 'Aliko Dangote',
    email: 'a.dangote@dangote.com',
    phone: '+234 803 000 0000',
    status: 'New',
    subject: 'Partnership Inquiry',
    created_at: new Date('2026-11-25T10:00:00Z')
  },
  {
    company_name: 'Peak Milk (Friesland...)',
    contact_name: 'Dr. Femi Oye',
    email: 'femi.oye@peak.com.ng',
    phone: '+234 812 000 0000',
    status: 'Read',
    subject: 'Partnership Inquiry',
    created_at: new Date('2026-11-25T14:30:00Z')
  },
  {
    company_name: 'Lagos State Gov (LASG)',
    contact_name: 'Mr. Sanwo-Olu',
    email: 'info@lagosstate.gov.ng',
    phone: '+234 809 000 0000',
    status: 'Resolved',
    subject: 'Partnership Inquiry',
    created_at: new Date('2026-11-23T09:15:00Z')
  },
  {
    company_name: 'Access Bank CSR',
    contact_name: 'Chidi Nwosu',
    email: 'chidi.nwosu@access.com',
    phone: '+234 810 000 0000',
    status: 'New',
    subject: 'Partnership Inquiry',
    created_at: new Date('2026-11-22T11:45:00Z')
  },
  {
    company_name: 'Shell Nigeria Dev...',
    contact_name: 'Aisha Bello',
    email: 'aisha.bello@shell.com',
    phone: '+234 813 000 0000',
    status: 'Resolved',
    subject: 'Partnership Inquiry',
    created_at: new Date('2026-11-20T16:20:00Z')
  }
];

async function seed() {
  console.log('Seeding company_requests...');
  
  // Insert new
  const { error } = await supabase.from('company_requests').insert(requests);
  
  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully inserted requests!', data);
  }
}

seed();
