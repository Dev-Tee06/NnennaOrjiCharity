import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jzxybtxdszwrllllaote.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eHlidHhkc3p3cmxsbGxhb3RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxNDU0NiwiZXhwIjoyMTA0NzkwNTQ2fQ.CnQc4K-YqGDlFok2VmhUbmgNA1ndgVw6yLRbFlEjaG4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('company_requests').select('*').limit(1);
  console.log('company_requests:', data);
  const { data: d2 } = await supabase.from('contact_messages').select('*').limit(1);
  console.log('contact_messages:', d2);
}

check();
