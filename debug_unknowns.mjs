
import fs from 'fs';
import xlsx from 'xlsx';

// Read the FINAL processed file
const outletsFinal = JSON.parse(fs.readFileSync('src/data/outlets_final.json', 'utf8'));

// Read original excel
const outletsFile = 'src/assets/PRICE COMPLIANT Outlets.xlsx';
const outWorkbook = xlsx.readFile(outletsFile);
const outData = xlsx.utils.sheet_to_json(outWorkbook.Sheets[outWorkbook.SheetNames[0]]);

console.log('--- TRUE Unknown Districts ---');
let count = 0;

outData.forEach((row, i) => {
    // outletsFinal matches index i (id = i+1)
    const processed = outletsFinal[i];

    if (processed && processed.district === 'Unknown District') {
        const loc = row['POC LOCATION'] ? row['POC LOCATION'].toString().trim() : "UNDEFINED";
        console.log(`[${processed.id}] ${processed.name} | Loc: "${loc}"`);
        count++;
    }
});

console.log(`Total Unknown: ${count}`);
