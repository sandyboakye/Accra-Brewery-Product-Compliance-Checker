import React, { useMemo } from 'react';
import outletsData from '../data/outlets_final.json';

const OutletList = ({ regionId, district, onSelectOutlet }) => {

    const filteredOutlets = useMemo(() => {
        // regionId from regions_final.json is "ashanti-region", 
        // but in outlets_final.json, region might be "Ashanti Region".
        // We should normalize or pass the full region name.
        // Let's assume passed regionId is actually the region Name for simplicity if we change App.jsx
        // Or we handle it here.
        return outletsData.filter(o => {
            // Simple string match or strict match depending on data quality
            const regionMatch = o.region === regionId || o.region.toLowerCase().includes(regionId.split('-')[0]);
            const districtMatch = o.district === district;
            return regionMatch && districtMatch;
        });
    }, [regionId, district]);

    return (
        <div className="outlet-container">
            {filteredOutlets.length === 0 ? (
                <div className="no-data">
                    <h3>No Outlets found in {district}</h3>
                    <p>We are constantly adding new compliant outlets.</p>
                </div>
            ) : (
                <div className="outlet-grid">
                    {filteredOutlets.map((outlet) => (
                        <div key={outlet.id} className="outlet-card" onClick={() => onSelectOutlet(outlet)}>
                            <div className="outlet-icon-wrapper">
                                {/* Generic Icon or First Product Image */}
                                <span className="store-icon">🏪</span>
                            </div>
                            <div className="outlet-info">
                                <h3 className="outlet-name">{outlet.name}</h3>
                                <p className="outlet-location">{outlet.region}, Ghana</p>
                                <button className="view-products-btn">View Products &rarr;</button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            <style>{`
        .outlet-container {
            animation: fadeIn 0.3s ease-out;
        }

        .outlet-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .outlet-card {
            background: var(--color-white);
            border-radius: var(--radius-md);
            padding: 0;
            box-shadow: var(--shadow-sm);
            cursor: pointer;
            transition: all 0.2s;
            border: 1px solid #eee;
            display: flex;
            align-items: center;
        }

        .outlet-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: var(--color-primary-green);
        }

        .outlet-icon-wrapper {
            width: 80px;
            height: 100%;
            min-height: 120px;
            background: var(--color-bg-light);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            border-right: 1px solid #eee;
        }

        .outlet-info {
            padding: 1.25rem;
            flex: 1;
        }

        .outlet-name {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
            color: var(--color-primary-dark);
        }

        .outlet-location {
            margin: 0 0 0.5rem 0;
            color: var(--color-muted);
            font-size: 0.9rem;
        }

        .outlet-coords {
            font-family: monospace;
            font-size: 0.8rem;
            color: #95a5a6;
            margin-bottom: 1rem;
            background: #f8f9fa;
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .view-products-btn {
            display: block;
            width: 100%;
            padding: 0.5rem;
            background: transparent;
            color: var(--color-primary-green);
            border: 1px solid var(--color-primary-green);
            border-radius: var(--radius-md);
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.2s;
            text-align: center;
        }

        .outlet-card:hover .view-products-btn {
            background-color: var(--color-primary-green);
            color: white;
        }

        .no-data {
            text-align: center;
            padding: 4rem;
            background: var(--color-white);
            border-radius: var(--radius-md);
            color: var(--color-muted);
            border: 1px dashed #ddd;
        }
      `}</style>
        </div >
    );
};

export default OutletList;
