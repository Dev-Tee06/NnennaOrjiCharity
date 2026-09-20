import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://jzxybtxdszwrllllaote.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eHlidHhkc3p3cmxsbGxhb3RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxNDU0NiwiZXhwIjoyMTA0NzkwNTQ2fQ.CnQc4K-YqGDlFok2VmhUbmgNA1ndgVw6yLRbFlEjaG4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('donations').select('*');
  if (error) {
    console.error(error);
    return;
  }
  
  let updatedCount = 0;
  for (const row of data) {
    if (!row.donation_type) {
      // Try to guess from message
      const msg = (row.message || '').toLowerCase();
      let type = 'food'; // Default
      
      if (msg.includes('cloth') || msg.includes('shirt') || msg.includes('shoe')) {
        type = 'cloth';
      } else if (msg.includes('medic') || msg.includes('drug') || msg.includes('health') || msg.includes('supply')) {
        type = 'medical_supply';
      }
      
      await supabase.from('donations').update({ donation_type: type }).eq('id', row.id);
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} rows with mapped categories.`);
}
run();
