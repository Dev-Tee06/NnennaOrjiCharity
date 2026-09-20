import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jzxybtxdszwrllllaote.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eHlidHhkc3p3cmxsbGxhb3RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxNDU0NiwiZXhwIjoyMTA0NzkwNTQ2fQ.CnQc4K-YqGDlFok2VmhUbmgNA1ndgVw6yLRbFlEjaG4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(2);
  console.log('Recent Donations:', JSON.stringify(data, null, 2));
  
  const { data: dData, error: dError } = await supabase.from('donors').select('*').limit(2);
  console.log('Donors:', JSON.stringify(dData, null, 2));
}

check();
