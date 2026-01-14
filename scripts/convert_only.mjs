import xlsx from 'xlsx';
import fs from 'fs';

const outletsFile = 'src/assets/PRICE COMPLIANT Outlets.xlsx';
const productsFile = 'src/assets/PRODUCTS DETAILS.xlsx';
const productImagesDir = 'public/images/products';

function convertData() {
    console.log('--- Converting Data (No Geocoding) ---');

    // 1. Products
    const prodWorkbook = xlsx.readFile(productsFile);
    const prodData = xlsx.utils.sheet_to_json(prodWorkbook.Sheets[prodWorkbook.SheetNames[0]]);
    const imageFiles = fs.readdirSync(productImagesDir);

    const finalProducts = prodData.map((p, index) => {
        const pName = p['Product'] ? p['Product'].toString().trim() : ("Product " + index);
        const pNameLower = pName.toLowerCase().replace(/[^a-z0-9]/g, '');

        let bestMatch = null;

        // Strategy: First look for exact match WITHOUT "PK" (Pack)
        // Then exact match WITH "PK"
        // Then fuzzy match

        const priorityFiles = imageFiles.filter(f => !f.toUpperCase().includes('PK'));
        const secondaryFiles = imageFiles.filter(f => f.toUpperCase().includes('PK'));

        // Helper to check match
        const findMatch = (files) => {
            for (const file of files) {
                const fNameLower = file.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (fNameLower.includes(pNameLower) || pNameLower.includes(fNameLower)) {
                    return file;
                }
            }
            return null;
        }

        bestMatch = findMatch(priorityFiles) || findMatch(secondaryFiles);

        return {
            id: index + 1,
            name: pName,
            type: p['Type'],
            priceRetail: p['Price to Retail'],
            priceUnit: p['Price Per Unit'],
            image: bestMatch ? `/images/products/${bestMatch}` : 'https://placehold.co/100x150?text=No+Image'
        };
    });
    fs.writeFileSync('src/data/products_final.json', JSON.stringify(finalProducts, null, 2));


    // 2. Outlets
    const outWorkbook = xlsx.readFile(outletsFile);
    const outData = xlsx.utils.sheet_to_json(outWorkbook.Sheets[outWorkbook.SheetNames[0]]);

    // Create a default region structure since we failed to geocode
    const defaultRegion = "Ghana";
    const defaultDistrict = "Unclassified";

    const finalOutlets = outData.map((row, index) => ({
        id: index + 1,
        name: row['POC NAME'],
        coordinates: { lat: row['LAT'], lng: row['LONG'] },
        region: defaultRegion,
        district: defaultDistrict
    }));

    fs.writeFileSync('src/data/outlets_final.json', JSON.stringify(finalOutlets, null, 2));

    // Regions data
    const regionsArray = [{
        id: 'ghana',
        name: defaultRegion,
        districts: [defaultDistrict]
    }];
    fs.writeFileSync('src/data/regions_final.json', JSON.stringify(regionsArray, null, 2));

    console.log('--- Done (Converted) ---');
}

convertData();
