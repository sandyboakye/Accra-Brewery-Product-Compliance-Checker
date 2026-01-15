import React from 'react';

const DistrictSelector = ({ region, outlets, onSelectDistrict }) => {
    // Helper to count outlets in a district
    const getOutletCount = (districtName) => {
        if (!outlets) return 0;
        return outlets.filter(o => o.district === districtName).length;
    };

    return (
        <div className="district-container">
            <div className="district-grid">
                {[...region.districts]
                    .sort((a, b) => getOutletCount(b) - getOutletCount(a))
                    .map((district, index) => {
                        const count = getOutletCount(district);
                        return (
                            <button
                                key={index}
                                className="district-card"
                                onClick={() => onSelectDistrict(district)}
                            >
                                <span className="district-name">{district}</span>
                                <span className="outlet-count">
                                    {count} {count === 1 ? 'Outlet' : 'Outlets'}
                                </span>
                            </button>
                        );
                    })}
            </div>

            <style>{`
        .district-container {
            animation: fadeIn 0.3s ease-out;
        }

        .district-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Slightly wider cards */
            gap: 1rem;
        }

        .district-card {
            display: flex;
            flex-direction: column; /* Stacked layout */
            align-items: flex-start;
            justify-content: center;
            background: var(--color-white);
            border: 1px solid rgba(0,0,0,0.05); /* Subtle border */
            padding: 1.5rem;
            border-radius: 12px;
            text-align: left;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-sm);
            gap: 0.5rem;
        }

        .district-card:hover {
            border-color: var(--color-primary-green);
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0, 135, 81, 0.1), 0 4px 6px -2px rgba(0, 135, 81, 0.05);
        }

        .district-name {
            font-weight: 600;
            color: var(--color-text-dark);
            font-size: 1.05rem;
        }

        .outlet-count {
            font-size: 0.8rem;
            color: var(--color-muted);
            background: var(--color-bg-light);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-weight: 500;
        }

        .district-card:hover .outlet-count {
            background: rgba(0, 135, 81, 0.1);
            color: var(--color-primary-green);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
       `}</style>
        </div>
    );
};

export default DistrictSelector;
