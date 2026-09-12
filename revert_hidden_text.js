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

  // Revert hidden text inside buttons so the text shows on mobile
  content = content.replace(/<span className="hidden sm:inline">Download Report<\/span>/g, 'Download Report');
  content = content.replace(/<span className="hidden sm:inline">Record New Pledge<\/span>/g, 'Record New Pledge');
  content = content.replace(/<span className="hidden sm:inline">Add New Admin<\/span>/g, 'Add New Admin');

  // Also fix the layout string just in case
  content = content.replace(
    /flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6/g,
    'flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 w-full'
  );

  fs.writeFileSync(path, content);
}
