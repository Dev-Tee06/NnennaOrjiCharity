const fs = require('fs');

const paths = [
  'src/app/admin/(dashboard)/requests/page.tsx',
  'src/app/admin/(dashboard)/roles/page.tsx',
  'src/app/admin/(dashboard)/notifications/page.tsx'
];

for (const path of paths) {
  if (!fs.existsSync(path)) continue;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    /<div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-\[400px\]">/g,
    '<div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] w-full min-w-0">'
  );
  fs.writeFileSync(path, content);
}
