const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\GALIH JP\\Desktop\\manasik360\\frontend\\src\\app\\dashboard\\modules\\[moduleId]\\page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('alert(')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
