import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jzxybtxdszwrllllaote.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eHlidHhkc3p3cmxsbGxhb3RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxNDU0NiwiZXhwIjoyMTA0NzkwNTQ2fQ.CnQc4K-YqGDlFok2VmhUbmgNA1ndgVw6yLRbFlEjaG4');
supabase.from('donations').update({ donation_type: 'medical_supply' }).eq('id', 'ba558bf9-65ea-4d7e-afca-86d44e3e153c').then(() => console.log('Fixed!'));
