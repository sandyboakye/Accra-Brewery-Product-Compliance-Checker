import React from 'react';
import LeafletMap from './LeafletMap';

const RegionSelector = ({ regions, outlets, onSelectRegion, onSelectOutlet }) => {
    const handleMapRegionSelect = (regionName) => {
        // Find region object by name (fuzzy match or exact)
        // GeoJSON uses "Ashanti", "Upper West" etc.
        // Our data uses "Ashanti Region", "Upper West Region" etc.
        // Let's try to match by inclusion
        if (!regionName) return;

        const foundRegion = regions.find(r =>
            r.name.toLowerCase().includes(regionName.toLowerCase()) ||
            regionName.toLowerCase().includes(r.name.toLowerCase())
        );

        if (foundRegion) {
            onSelectRegion(foundRegion);
        } else {
            console.warn(`Region not found for map selection: ${regionName}`);
        }
    };

    const sortedRegions = React.useMemo(() => {
        if (!regions) return [];
        return [...regions].sort((a, b) => {
            const getCount = (r) => {
                if (!outlets) return 0;
                const normalize = str => str.toLowerCase().replace(' region', '').trim();
                const rName = normalize(r.name);

                return outlets.filter(o => {
                    if (!o.region) return false;
                    const oRegion = normalize(o.region);
                    return oRegion === rName;
                }).length;
            };
            return getCount(b) - getCount(a);
        });
    }, [regions, outlets]);

    return (
        <div className="dashboard-layout">
            {/* Sidebar Left */}
            <div className="sidebar">
                {/* Header */}
                {/* Header removed to avoid duplication with Layout title */}

                {/* Region List */}
                <div className="region-list">
                    {sortedRegions.map((region) => {
                        const count = region.districts ? region.districts.length : 0;
                        return (
                            <button
                                key={region.id}
                                onClick={() => onSelectRegion(region)}
                                className="region-item"
                            >
                                <span className="region-name">{region.name}</span>
                                <span className="district-count">
                                    {count} {count === 1 ? 'District' : 'Districts'}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {/* Footer */}
                <div className="sidebar-footer">
                    <p>{regions.length} Regions Available</p>
                </div>
            </div>

            {/* Map Right */}
            <div className="map-container">
                <LeafletMap
                    className="ghana-map"
                    outlets={outlets}
                    onSelectOutlet={onSelectOutlet}
                    onRegionSelect={handleMapRegionSelect}
                />
            </div>

            <style>{`
                .dashboard-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    height: calc(100vh - 140px); /* Height minus header (80px) and footer (~60px) */
                    background-color: var(--color-bg-light);
                    overflow: hidden;
                    margin: -2rem -1rem; /* Negate Layout padding to fit full screen */
                    border-radius: var(--radius-md);
                }

                /* Sidebar Styling */
                .sidebar {
                    background: white;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 5px 0 20px rgba(0,0,0,0.02);
                    z-index: 10;
                    height: 100%;
                    overflow: hidden; /* Prevent sidebar itself from growing */
                }

                .sidebar-header h2 {
                    color: var(--color-primary-green);
                    font-size: 1.75rem;
                    margin-bottom: 0.5rem;
                }

                .sidebar-header p {
                    color: var(--color-muted);
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                }

                .region-list {
                    flex: 1;
                    overflow-y: auto; /* Enable vertical scroll for this section */
                    display: flex;
                    flex-direction: column;
                    gap: 1rem; /* Match district gap */
                    padding-right: 0.5rem;
                    padding-bottom: 2rem;
                    scrollbar-width: thin; /* Firefox */
                }

                /* Sleek Scrollbar */
                .region-list::-webkit-scrollbar {
                    width: 6px;
                }
                .region-list::-webkit-scrollbar-track {
                    background: transparent;
                }
                .region-list::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 3px;
                }
                .region-list::-webkit-scrollbar-thumb:hover {
                    background: #aaa;
                }

                .region-item {
                    display: flex;
                    flex-direction: column; /* Stacked Layout */
                    align-items: flex-start;
                    justify-content: center;
                    padding: 1.5rem; /* Spacious padding */
                    background: var(--color-white);
                    border: 1px solid rgba(0,0,0,0.05);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                    box-shadow: var(--shadow-sm);
                    gap: 0.5rem; /* Spacing between title and badge */
                    text-align: left; /* Ensure text alignment for button */
                    width: 100%; /* Ensure button takes full width */
                }

                .region-item:hover {
                    background: var(--color-white);
                    border-color: var(--color-primary-green);
                    box-shadow: 0 10px 15px -3px rgba(0, 135, 81, 0.1), 0 4px 6px -2px rgba(0, 135, 81, 0.05);
                    transform: translateY(-3px);
                }

                .region-name {
                    font-weight: 600;
                    color: var(--color-text-dark);
                    font-size: 1.05rem;
                }
                
                .district-count {
                    font-size: 0.8rem;
                    color: var(--color-muted);
                    font-weight: 500;
                    background: var(--color-bg-light);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    display: inline-block;
                    align-self: flex-start;
                }
                
                .region-item:hover .district-count {
                    background: rgba(0, 135, 81, 0.1);
                    color: var(--color-primary-green);
                }

                .sidebar-footer {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #eee;
                    font-size: 0.8rem;
                    color: var(--color-muted);
                    text-align: center;
                    flex-shrink: 0;
                }

                /* Map Container Styling */
                .map-container {
                    position: relative;
                    background: white;
                    padding: 0; /* No padding for edge-to-edge map */
                }

                .map-overlay {
                    position: absolute;
                    top: 2rem;
                    right: 3rem;
                    text-align: right;
                    z-index: 1000; /* Ensure overlay is above map tiles */
                    pointer-events: none; /* Allow clicks to pass through to map */
                }

                .map-overlay h1 {
                    font-size: 3rem;
                    color: var(--color-primary-green);
                    text-shadow: 0 2px 4px rgba(255,255,255,0.8);
                    line-height: 1;
                    margin: 0;
                }

            @media (max-width: 900px) {
                .dashboard-layout {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto 1fr; /* Stack: List, Map */
                    margin: 0; /* Reset margin on mobile to prevent overlap */
                    border-radius: 0;
                    height: auto;
                    min-height: calc(100vh - 80px);
                }

                .sidebar {
                     padding: 1rem;
                     order: 2; /* Put list BELOW map */
                }


                    .map-container {
                        display: block; /* Show map on mobile */
                        order: -1; /* Place map at TOP */
                    }
                }
            `}</style>
        </div>
    );
};

export default RegionSelector;
