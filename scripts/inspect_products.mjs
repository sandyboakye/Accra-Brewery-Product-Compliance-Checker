import * as xlsx from 'xlsx';

const SHEET_ID = '1Kz4qYIyJRIUQ-XDA2oePKlvqiqNLLH8Ym7-i1cGxtyg';

async function fetchSheet(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    console.log(`Fetching ${sheetName}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
    const csvText = await res.text();
    const workbook = xlsx.read(csvText, { type: 'string' });
    return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
}

async function run() {
    try {
        const products = await fetchSheet('Products');
        const targets = products.filter(p =>
            p['Product'] && (p['Product'].includes('CLUB DRAUGHT PG') || p['Product'].includes('STELLA ARTOIS DRAUGHT PG'))
        );
        console.log('--- Found Target Products ---');
        console.log(JSON.stringify(targets, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
