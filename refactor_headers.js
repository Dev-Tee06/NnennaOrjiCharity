const fs = require('fs');

const pages = [
  { path: 'src/app/admin/(dashboard)/page.tsx', title: 'Dashboard Overview' },
  { path: 'src/app/admin/(dashboard)/donations/page.tsx', title: 'Pledges & Donations' },
  { path: 'src/app/admin/(dashboard)/requests/page.tsx', title: 'Corporate & Strategic Partnership Inquiries' },
  { path: 'src/app/admin/(dashboard)/roles/page.tsx', title: 'Admin Portal Users & Permissions' },
  { path: 'src/app/admin/(dashboard)/notifications/page.tsx', title: 'Notifications Center' },
  { path: 'src/app/admin/(dashboard)/profile/page.tsx', title: 'Edit Admin Profile' },
  { path: 'src/app/admin/(dashboard)/settings/page.tsx', title: 'System Settings' }
];

for (const { path, title } of pages) {
  if (!fs.existsSync(path)) continue;
  
  let content = fs.readFileSync(path, 'utf8');

  // Regex to extract the <header> block entirely
  const headerRegex = /<header className="flex h-20[\s\S]*?<\/header>/;
  
  if (headerRegex.test(content)) {
    // Add imports if not present
    if (!content.includes('TopHeader')) {
      content = content.replace(/(import .*?;[\r\n]+)(?!import)/, `$1import { TopHeader } from '@/components/dashboard/TopHeader';\nimport { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';\n`);
    }

    // Replace <header>
    content = content.replace(
      headerRegex,
      `<TopHeader title="${title}" />\n      <MobilePageTitle title="${title}" />`
    );
    
    // Fix grid classes for metric cards: "grid-cols-2 lg:grid-cols-4" or "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" -> "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    content = content.replace(/grid-cols-2 lg:grid-cols-4/g, 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4');
    
    // Also Dashboard Overview top 4 cards
    content = content.replace(/grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4/g, 'grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4');

    // Make CTA buttons stack completely on mobile (w-full on mobile, auto on sm/md)
    content = content.replace(
      /className="flex items-center gap-2 bg-orangeRed1/g,
      'className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orangeRed1'
    );
    content = content.replace(
      /className="flex items-center gap-2 bg-white border border-border rounded-md px-4 py-2/g,
      'className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-border rounded-md px-4 py-2'
    );
    content = content.replace(
      /className="flex items-center gap-2 text-sm font-bold text-blackKnight hover:text-orangeRed1/g,
      'className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-blackKnight hover:text-orangeRed1 mt-4 sm:mt-0 bg-white border border-border sm:border-0 rounded-md p-2 sm:p-0"'
    );

    // Some places had `flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4`
    // Ensure the CTA container is block or flex-col on mobile.
    content = content.replace(
      /flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6/g,
      'flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 w-full'
    );
    content = content.replace(
      /flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4/g,
      'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full'
    );

    fs.writeFileSync(path, content);
    console.log(`Refactored header in ${path}`);
  }
}
