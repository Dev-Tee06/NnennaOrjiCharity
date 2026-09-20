const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('donations').select('*').limit(1);
  console.log('Donations:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
  
  const { data: dData, error: dError } = await supabase.from('donors').select('*').limit(1);
  console.log('Donors:', JSON.stringify(dData, null, 2));
  console.log('Donor Error:', dError);
}

check();
