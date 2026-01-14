import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

// Import Static Data
import { regions as textRegions } from '../src/data/regions.js';

// Paths
const outletsFile = 'src/assets/PRICE COMPLIANT Outlets.xlsx';
const productsFile = 'src/assets/PRODUCTS DETAILS.xlsx';
const productImagesDir = 'public/images/products';
const geoJsonFile = 'src/data/ghana_regions.json';

// --- GEOMETRY HELPERS ---

function pointInPolygon(point, vs) {
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

function getCentroid(coords) {
    let x = 0, y = 0, n = coords.length;
    for (let i = 0; i < n; i++) {
        x += coords[i][0];
        y += coords[i][1];
    }
    return [x / n, y / n];
}

function getRegionFromPoint(lat, lng, features) {
    for (const feature of features) {
        if (feature.geometry.type === 'Polygon') {
            const poly = feature.geometry.coordinates[0];
            if (pointInPolygon([lng, lat], poly)) return feature.properties.region;
        } else if (feature.geometry.type === 'MultiPolygon') {
            for (const poly of feature.geometry.coordinates) {
                if (pointInPolygon([lng, lat], poly[0])) return feature.properties.region;
            }
        }
    }
    return null;
}

function getCentroidOfRegion(regionName, features) {
    const feature = features.find(f => {
        const rName = f.properties.region.toLowerCase().trim();
        const target = regionName.toLowerCase().trim().replace(' region', '');
        return rName === target || rName.includes(target);
    });
    if (!feature) return null;
    let points = [];
    if (feature.geometry.type === 'Polygon') points = feature.geometry.coordinates[0];
    else if (feature.geometry.type === 'MultiPolygon') points = feature.geometry.coordinates[0][0];
    const center = getCentroid(points);
    return { lat: center[1], lng: center[0] };
}

const SHEET_ID = '1Kz4qYIyJRIUQ-XDA2oePKlvqiqNLLH8Ym7-i1cGxtyg';

async function fetchSheet(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    console.log(`Fetching ${sheetName} from Google Sheets...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${sheetName}: ${res.statusText}`);
    const csvText = await res.text();
    const workbook = xlsx.read(csvText, { type: 'string' });
    return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
}

// --- MAIN PROCESS ---

async function processData() {
    console.log('--- Starting Data Processing (Source: Google Sheets) ---');

    console.log('Loading GeoJSON...');
    const geoJsonRaw = fs.readFileSync(geoJsonFile, 'utf8');
    const geoJson = JSON.parse(geoJsonRaw);
    const regionFeatures = geoJson.features;

    // 1. Products
    console.log('Processing Products...');
    // const prodWorkbook = xlsx.readFile(productsFile);
    // const prodData = xlsx.utils.sheet_to_json(prodWorkbook.Sheets[prodWorkbook.SheetNames[0]]);
    const prodData = await fetchSheet('Products');

    const imageFiles = fs.readdirSync(productImagesDir);

    const finalProducts = prodData.map((p, index) => {
        // Clean the product name: remove newlines, trim
        const pName = p['Product'] ? p['Product'].toString().replace(/[\r\n]+/g, '').trim() : ("Product " + index);
        const pNameLower = pName.toLowerCase().replace(/[^a-z0-9]/g, ''); // alphanumeric for loose check

        let bestMatch = null;
        let bestScore = 0;

        // Manual Overrides for Mismatched Names
        const MANUAL_IMAGE_MAP = {
            'CLUB LARGE': 'Club Lager 625ml.jpg',
            'CLUB MINI': 'Club Lager 330ml.jpg',
            'CLUB DRAUGHT PG': 'CLUB DRAUGHT PG.jpeg',
            'STELLA ARTOIS DRAUGHT PG': 'STELLA ARTOIS DRAUGHT PG.jpeg'
        };

        if (MANUAL_IMAGE_MAP[pName]) {
            bestMatch = MANUAL_IMAGE_MAP[pName];
        } else {
            // 1. Try Exact Match (ignoring extension)
            for (const file of imageFiles) {
                const fileNameNoExt = path.parse(file).name;
                if (fileNameNoExt.toLowerCase() === pName.toLowerCase()) {
                    bestMatch = file;
                    break; // Found exact match, stop matching
                }
            }
        }

        // 2. Fuzzy Match (Fallback)
        if (!bestMatch) {
            const keywords = pName.split(' ').filter(w => w.length > 2);
            for (const file of imageFiles) {
                // If we already exact matched, loop won't run as bestMatch is set? No, we need to skip if valid.
                // Actually my logic above `if (fileNameNoExt...) break;` works perfectly.
                // But we need to ensure we don't overwrite exact match with fuzzy match with lower score??
                // Wait, if bestMatch is set, we shouldn't run fuzzy.

                // Let's refactor loop:
                // We Iterate ONCE or split into two stages?
                // Simpler: Just check if (!bestMatch)

                let score = 0;
                for (const word of keywords) {
                    if (file.toLowerCase().includes(word.toLowerCase())) score++;
                }

                // Bonus for containing "PK" if product has "PK"
                if (pName.includes('PK') && file.includes('PK')) score += 5;

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = file;
                }
            }
        }

        // Determine Category
        let category = 'Singles';
        const typeLower = p['Type'] ? p['Type'].toString().toLowerCase() : '';

        if (typeLower.includes('30lts') || pNameLower.includes('draught')) {
            category = 'Bubra';
        } else if (pNameLower.includes('pk') || typeLower.includes(' x ')) {
            // Check for ' x ' to catch "330ml x 24" etc, or explicit PK in name
            category = 'Crates/Packs';
        }

        // Create Display Name (Remove "PK" and "PG" and trim)
        let displayName = pName
            .replace(/\s+PK$/i, '').replace(/PK/i, '')
            .replace(/\s+PG$/i, '').replace(/PG/i, '')
            .trim();
        // Note: Simple replace "PK" might kill "Park"? Unlikely in beer names, but safer to match whole word if possible.
        // The user said "remove pk from the displayed items". 
        // "STELLA ARTOIS NRB PK" -> "STELLA ARTOIS NRB"

        return {
            id: index + 1,
            name: pName, // Keep original name for logic/debugging if needed
            displayName: displayName,
            category: category,
            type: p['Type'],
            priceRetail: p['Price to Retail'],
            priceUnit: p['Price Per Unit'],
            image: bestMatch ? `/images/products/${bestMatch}` : 'https://placehold.co/100x150?text=No+Image'
        };
    });
    fs.writeFileSync('src/data/products_final.json', JSON.stringify(finalProducts, null, 2));

    // 2. Outlets
    console.log('Processing Outlets...');
    // const outWorkbook = xlsx.readFile(outletsFile);
    // const outData = xlsx.utils.sheet_to_json(outWorkbook.Sheets[outWorkbook.SheetNames[0]]);
    const outData = await fetchSheet('Outlets');

    const finalOutlets = [];
    const districtsMap = {};
    textRegions.forEach(r => districtsMap[r.name] = new Set(r.districts));

    // Extended Alias Map
    const DISTRICT_ALIASES = {
        // Major Capitals
        'kumasi': 'Kumasi Metropolitan',
        'accra': 'Accra Metropolitan',
        'tema': 'Tema Metropolitan',
        'tamale': 'Tamale Metropolitan',
        'takoradi': 'Sekondi-Takoradi Metropolitan',
        'cape coast': 'Cape Coast Metropolitan',
        'bolga': 'Bolgatanga Municipal',
        'bolgatanga': 'Bolgatanga Municipal',
        'wa': 'Wa Municipal',
        'sunyani': 'Sunyani Municipal',
        'techiman': 'Techiman Municipal',
        'ho': 'Ho Municipal',
        'koforidua': 'New Juaben South',

        // Greater Accra Suburbs
        'kasoa': 'Awutu Senya East',
        'ashaiman': 'Ashaiman Municipal',
        'madina': 'La Nkwantanang Madina',
        'adenta': 'Adenta Municipal',
        'osu': 'Accra Metropolitan',
        'cantonments': 'Accra Metropolitan',
        'east legon': 'Accra Metropolitan',
        'spintex': 'Tema Metropolitan',
        'prampram': 'Ningo Prampram',
        'kpone': 'Kpone Katamanso',
        'michel camp': 'Kpone Katamanso',
        'gbetsele': 'Kpone Katamanso',
        'darkuman': 'Accra Metropolitan',
        'kaneshie': 'Accra Metropolitan',
        'odorkor': 'Accra Metropolitan',
        'buabuashie': 'Accra Metropolitan',
        'kokrobite': 'Ga South',
        'gbawe': 'Ga South',
        'awoshie': 'Ga Central',
        'amasaman': 'Ga West',
        'manhean': 'Ga West',
        'ablekuma': 'Ga Central',
        'afiaman': 'Ga West',

        // Northern / Upper East Towns
        'walewale': 'West Mamprusi',
        'nalerigu': 'East Mamprusi',
        'navrongo': 'Kassena-Nankana Municipal',
        'sandema': 'Builsa North',
        'wiaga': 'Builsa North',
        'bole': 'Bole',
        'sawla': 'Sawla-Tuna-Kalba',
        'tinga': 'Bole',
        'jirapa': 'Jirapa',

        // Western / Other
        'axim': 'Nzema East',
        'nkroful': 'Ellembelle',
        'essiama': 'Ellembelle',
        'ekwei': 'Ellembelle',
        'half assini': 'Jomoro',
        'kokompe': 'Accra Metropolitan', // Darkuman area
        'afienya': 'Ningo Prampram',
        'mechel camp': 'Kpone Katamanso' // Typo fix for 'Michel Camp'
    };

    let count = 0;
    for (const row of outData) {
        count++;
        const name = row['POC NAME'];
        let lat = parseFloat(row['LAT']);
        let lng = parseFloat(row['LONG']);
        // Crucial: Use 'POC LOCATION'
        const manualLocation = row['POC LOCATION'] ? row['POC LOCATION'].toString().trim() : "";

        let region = "Unknown Region";
        let district = "Unknown District";
        let validCoords = false;

        // A. Coordinate Check
        if (!isNaN(lat) && !isNaN(lng)) {
            if (lat > 4.5 && lat < 11.5 && lng > -3.5 && lng < 1.5) {
                validCoords = true;
                const polyRegion = getRegionFromPoint(lat, lng, regionFeatures);
                if (polyRegion) {
                    const stdRegion = textRegions.find(tr => tr.name.includes(polyRegion));
                    region = stdRegion ? stdRegion.name : polyRegion + " Region";
                }
            }
        }

        // B. Text Matching (Priority Overwrite)
        if (manualLocation) {
            const locLower = manualLocation.toLowerCase();
            let matchedRegion = null;
            let matchedDistrict = null;

            // 1. Check Aliases
            for (const [alias, distName] of Object.entries(DISTRICT_ALIASES)) {
                if (locLower.includes(alias)) {
                    matchedDistrict = distName;
                    matchedRegion = textRegions.find(r => r.districts.includes(distName));
                    break;
                }
            }

            // 2. Check Standard Districts
            if (!matchedDistrict) {
                for (const r of textRegions) {
                    for (const d of r.districts) {
                        if (locLower.includes(d.toLowerCase())) {
                            matchedDistrict = d;
                            matchedRegion = r;
                            break;
                        }
                    }
                    if (matchedDistrict) break;
                }
            }

            if (matchedDistrict) {
                district = matchedDistrict;
                // If Region Changed (Text vs Coord), Trust Text & Snap
                // ALSO: If Region was "Unknown Region", set it.
                if (matchedRegion) {
                    if (matchedRegion.name !== region) {
                        region = matchedRegion.name;
                        // Snap Coord
                        const cent = getCentroidOfRegion(region, regionFeatures);
                        if (cent) {
                            lat = cent.lat;
                            lng = cent.lng;
                            validCoords = true;
                        }
                    }
                }
            } else if (region === "Unknown Region") {
                // 3. Fallback: Check for Region Name in Text
                for (const r of textRegions) {
                    if (locLower.includes(r.name.toLowerCase().replace(' region', ''))) {
                        matchedRegion = r;
                        break;
                    }
                }
                if (matchedRegion) {
                    region = matchedRegion.name;
                    // Snap
                    const cent = getCentroidOfRegion(region, regionFeatures);
                    if (cent) {
                        lat = cent.lat;
                        lng = cent.lng;
                        validCoords = true;
                    }
                }
            }
        }

        if (!validCoords) { lat = null; lng = null; }

        finalOutlets.push({
            id: count,
            name: name,
            coordinates: { lat, lng },
            region: region,
            district: district
        });
    }

    fs.writeFileSync('src/data/outlets_final.json', JSON.stringify(finalOutlets, null, 2));

    const regionsArray = Object.keys(districtsMap).map((r, i) => ({
        id: r.toLowerCase().replace(/\s+/g, '-'),
        name: r,
        districts: Array.from(districtsMap[r]).sort()
    })).sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync('src/data/regions_final.json', JSON.stringify(regionsArray, null, 2));

    console.log('--- Done (Extended Aliases) ---');
}

processData();
