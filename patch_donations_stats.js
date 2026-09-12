const fs = require('fs');

const path = 'src/app/admin/(dashboard)/donations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the hardcoded zeroes
content = content.replace(
  /<span className="text-2xl font-heading font-bold text-blackKnight">0<\/span>/,
  '<span className="text-2xl font-heading font-bold text-blackKnight">{pledges.length}</span>'
);

content = content.replace(
  /<span className="text-2xl font-heading font-bold text-green-600">0<\/span>/,
  `<span className="text-2xl font-heading font-bold text-green-600">
                {pledges.filter(p => p.status === 'Completed' || p.status === 'Handed Over' || p.status === 'Resolved').length}
              </span>`
);

content = content.replace(
  /<span className="text-2xl font-heading font-bold text-blue-600">0<\/span>/,
  `<span className="text-2xl font-heading font-bold text-blue-600">
                {pledges.filter(p => p.status === 'In Transit').length}
              </span>`
);

content = content.replace(
  /<span className="text-2xl font-heading font-bold text-orangeRed1">0<\/span>/,
  `<span className="text-2xl font-heading font-bold text-orangeRed1">
                {pledges.filter(p => p.status === 'Pending').length}
              </span>`
);

fs.writeFileSync(path, content);
console.log('Patched donations page stats');
