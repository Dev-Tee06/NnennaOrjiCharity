const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images');

async function processImages() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // If larger than 500KB, compress and resize
      if (stat.size > 500 * 1024) {
        console.log(`Compressing ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
        const tempPath = path.join(dir, `temp_${file}`);
        
        try {
          if (file.toLowerCase().endsWith('.png')) {
             await sharp(filePath)
              .resize({ width: 1920, withoutEnlargement: true })
              .png({ quality: 80, compressionLevel: 8 })
              .toFile(tempPath);
          } else {
             await sharp(filePath)
              .resize({ width: 1920, withoutEnlargement: true })
              .jpeg({ quality: 75, mozjpeg: true })
              .toFile(tempPath);
          }
          
          fs.renameSync(tempPath, filePath);
          const newStat = fs.statSync(filePath);
          console.log(`Done: ${file} is now ${(newStat.size / 1024).toFixed(2)} KB`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    }
  }
}

processImages();
