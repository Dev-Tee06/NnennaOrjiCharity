const fs = require('fs');

const paths = [
  'src/app/admin/(dashboard)/page.tsx',
  'src/app/admin/(dashboard)/donations/page.tsx',
  'src/app/admin/(dashboard)/requests/page.tsx',
  'src/app/admin/(dashboard)/roles/page.tsx',
  'src/app/admin/(dashboard)/notifications/page.tsx',
  'src/app/admin/(dashboard)/profile/page.tsx',
  'src/app/admin/(dashboard)/settings/page.tsx'
];

for (const path of paths) {
  if (!fs.existsSync(path)) continue;
  
  let content = fs.readFileSync(path, 'utf8');

  // Fix flex containers to prevent blowout
  content = content.replace(
    /<div className="flex-1 flex flex-col h-full bg-offWhite/g,
    '<div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full'
  );
  
  // Make tables strictly scrollable without stretching parent
  content = content.replace(
    /<div className="overflow-x-auto flex-1 flex flex-col">/g,
    '<div className="overflow-x-auto flex-1 flex flex-col w-full min-w-0">'
  );
  
  fs.writeFileSync(path, content);
  console.log(`Patched min-w-0 into ${path}`);
}
