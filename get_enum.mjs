import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jzxybtxdszwrllllaote.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eHlidHhkc3p3cmxsbGxhb3RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxNDU0NiwiZXhwIjoyMTA0NzkwNTQ2fQ.CnQc4K-YqGDlFok2VmhUbmgNA1ndgVw6yLRbFlEjaG4';

async function check() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
  const data = await res.json();
  const enumVals = data.definitions.donations.properties.status.enum;
  console.log('Allowed status values:', enumVals);
}

check();
