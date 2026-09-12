const fs = require('fs');

const path = 'src/app/admin/(dashboard)/profile/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to inject useState and useEffect for the user
// 1. imports
content = content.replace(
  /import { Search, Bell, ChevronDown, Camera, Save } from 'lucide-react';/,
  `import { Search, Bell, ChevronDown, Camera, Save } from 'lucide-react';\nimport { useState, useEffect } from 'react';\nimport { createClient } from '@/lib/supabase/client';`
);

// 2. State
content = content.replace(
  /export default function AdminProfilePage\(\) {/,
  `export default function AdminProfilePage() {\n  const [user, setUser] = useState<{name: string, initial: string, email: string} | null>(null);\n  const supabase = createClient();\n\n  useEffect(() => {\n    supabase.auth.getUser().then(({ data: { user } }) => {\n      if (user) {\n        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';\n        setUser({\n          name: name,\n          initial: name.charAt(0).toUpperCase(),\n          email: user.email || ''\n        });\n      } else {\n        setUser({ name: 'Admin', initial: 'A', email: '' });\n      }\n    });\n  }, []);\n`
);

// 3. EO -> initial
content = content.replace(
  /EO<\/div>/,
  `{user?.initial || 'A'}</div>`
);

// 4. Name
content = content.replace(
  /<h2 className="text-xl font-heading font-bold text-blackKnight">Eniola Obadeji<\/h2>/,
  `<h2 className="text-xl font-heading font-bold text-blackKnight">{user?.name || 'Loading...'}</h2>`
);

// 5. Input default value (using value instead and readOnly or onChange)
// actually let's just make it a controlled input or defaultValue with key
content = content.replace(
  /<input\s+type="text"\s+defaultValue="Eniola Obadeji"/,
  `<input type="text" value={user?.name || ''} readOnly disabled`
);

content = content.replace(
  /<input\s+type="email"\s+defaultValue="eniola.obadeji@nocf.org"/,
  `<input type="email" value={user?.email || ''} readOnly disabled`
);

fs.writeFileSync(path, content);
console.log("Patched profile/page.tsx");
