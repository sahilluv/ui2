const fs = require('fs');

const content = fs.readFileSync('src/components/PhoneSimulator.tsx', 'utf8');

// Find all children tags of the main container in PhoneSimulator
const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Let's search for "div:nth-of-type(4) > div:nth-of-type(2)" or see what's in PhoneSimulator:
// Look at lines 3670-3934:
for (let i = 3675; i < 3934; i++) {
  if (lines[i].includes('<div') || lines[i].includes('</div') || lines[i].includes('<BottomNavigation') || lines[i].includes('<ReelCommentsDrawer') || lines[i].includes('<ShareSheetModal')) {
    console.log(`${i+1}: ${lines[i].trim()}`);
  }
}
