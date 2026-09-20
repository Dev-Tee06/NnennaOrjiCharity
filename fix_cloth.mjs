import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fix() {
  const { data, error } = await supabase.from('donations').select('*');
  if (error) {
    console.error(error);
    return;
  }
  
  let updated = 0;
  for (const d of data) {
    if (d.donation_type === 'clothing' || (d.donation_type === 'food' && d.message && d.message.toLowerCase().includes('cloth'))) {
      console.log('Fixing:', d);
      await supabase.from('donations').update({ donation_type: 'cloth' }).eq('id', d.id);
      updated++;
    }
  }
  console.log(`Updated ${updated} records.`);
}
fix();
