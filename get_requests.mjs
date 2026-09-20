import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://jzxybtxdszwrllllaote.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eHlidHhkc3p3cmxsbGxhb3RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxNDU0NiwiZXhwIjoyMTA0NzkwNTQ2fQ.CnQc4K-YqGDlFok2VmhUbmgNA1ndgVw6yLRbFlEjaG4';
const supabase = createClient(supabaseUrl, supabaseKey);
async function check() {
  const p = await supabase.from('partnerships').select('*').limit(1);
  const ce = await supabase.from('company_enquiries').select('*').limit(1);
  const cr = await supabase.from('company_requests').select('*').limit(1);
  console.log('partnerships:', p.error ? p.error.message : p.data);
  console.log('company_enquiries:', ce.error ? ce.error.message : ce.data);
  console.log('company_requests:', cr.error ? cr.error.message : cr.data);
}
check();
