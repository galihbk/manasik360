const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\GALIH JP\\Desktop\\manasik360\\frontend\\src';
const ignoreDirs = ['node_modules', '.git', '.next'];

function searchAlerts(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        searchAlerts(fullPath);
      }
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('alert(')) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('alert(')) {
              console.log(`${fullPath}:${index + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchAlerts(rootDir);
