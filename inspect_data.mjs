import xlsx from 'xlsx';
import fs from 'fs';

const outletsFile = 'src/assets/PRICE COMPLIANT Outlets.xlsx';
const productsFile = 'src/assets/PRODUCTS DETAILS.xlsx';

function readExcel(file) {
    console.log(`Reading ${file}...`);
    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log(`Found ${data.length} rows.`);
    console.log('Sample row:', data[0]);
    return data;
}

const outlets = readExcel(outletsFile);
const products = readExcel(productsFile);
