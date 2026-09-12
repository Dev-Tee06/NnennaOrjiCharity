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

  // Fix Header Search Bar: Make it hidden on mobile
  content = content.replace(
    /<div className="relative">\s*<div className="pointer-events-none absolute/g,
    '<div className="relative hidden md:block">\n            <div className="pointer-events-none absolute'
  );

  // Fix Profile Name: Hide on mobile
  content = content.replace(
    /<span className="text-sm font-bold text-blackKnight">\s*Eniola Obadeji\s*<\/span>/g,
    '<span className="text-sm font-bold text-blackKnight hidden sm:block">\n              Eniola Obadeji\n            </span>'
  );

  // Fix Profile Chevron: Hide on mobile
  content = content.replace(
    /<ChevronDown className="h-4 w-4 text-gray-500 ml-1" \/>/g,
    '<ChevronDown className="h-4 w-4 text-gray-500 ml-1 hidden sm:block" />'
  );
  
  // Fix Header padding/gap for mobile
  content = content.replace(
    /gap-x-6/g,
    'gap-x-4 md:gap-x-6'
  );
  
  // Fix Page padding inside main area to be p-4 on mobile, p-8 on desktop
  content = content.replace(
    /<div className="flex-1 overflow-y-auto p-8/g,
    '<div className="flex-1 overflow-y-auto p-4 md:p-8'
  );

  // Fix Grids
  content = content.replace(
    /grid-cols-4/g,
    'grid-cols-2 lg:grid-cols-4'
  );
  
  content = content.replace(
    /grid-cols-1 lg:grid-cols-2/g,
    'grid-cols-1 xl:grid-cols-2'
  );
  
  content = content.replace(
    /grid-cols-3/g,
    'grid-cols-1 lg:grid-cols-3'
  );

  // Profile Form Grid
  content = content.replace(
    /grid-cols-2 gap-6/g,
    'grid-cols-1 md:grid-cols-2 gap-6'
  );
  
  // Profile Form top grid
  content = content.replace(
    /grid-cols-1 lg:grid-cols-3/g,
    'grid-cols-1 lg:grid-cols-3' // leave as is
  );
  
  // Table Action Buttons text hide on mobile
  content = content.replace(
    /Download Report/g,
    '<span className="hidden sm:inline">Download Report</span>'
  );
  content = content.replace(
    /Record New Pledge/g,
    '<span className="hidden sm:inline">Record New Pledge</span>'
  );
  content = content.replace(
    /Add New Admin/g,
    '<span className="hidden sm:inline">Add New Admin</span>'
  );

  // Write back
  fs.writeFileSync(path, content);
  console.log(`Patched ${path}`);
}
