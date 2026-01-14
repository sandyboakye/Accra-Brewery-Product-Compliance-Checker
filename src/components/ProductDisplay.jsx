import React, { useState } from 'react';
import productsData from '../data/products_final.json';

const ProductDisplay = ({ outlet }) => {
    const [activeTab, setActiveTab] = useState('Singles');

    const tabs = ['Singles', 'Crates/Packs', 'Bubra'];

    const filteredProducts = productsData.filter(p => {
        if (activeTab === 'Bubra') return p.category === 'Bubra';
        if (activeTab === 'Crates/Packs') return p.category === 'Crates/Packs';
        return p.category === 'Singles';
    });

    return (
        <div className="product-display">
            <div className="outlet-details">
                <h3>{outlet.name}</h3>
                <p className="location-text">
                    {outlet.region}, Ghana
                </p>
                <a
                    href={`https://www.google.com/maps?q=${outlet.coordinates.lat},${outlet.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-map-btn"
                >
                    View on Google Maps
                </a>

                <div style={{ marginTop: '1rem' }}>
                    <p className="status-text">
                        <span className="status-badge">Price Compliant Outlet</span>
                    </p>
                </div>
            </div>

            <div className="tabs-container">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-area">
                                <img src={product.image} alt={product.name} onError={(e) => e.target.src = 'https://placehold.co/100x150?text=No+Image'} />
                            </div>
                            <div className="product-details">
                                <h4 className="product-name">{product.displayName || product.name}</h4>
                                <p className="product-type">{product.type}</p>
                                <div className="price-tag">
                                    <span className="price-label">Retail Price</span>
                                    <span className="price-value">{product.priceRetail}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products">
                        <p>No products found in this category.</p>
                    </div>
                )}
            </div>

            <style>{`
        .product-display {
            animation: slideUp 0.3s ease-out;
        }

        .outlet-details {
            text-align: center;
            margin-bottom: 2rem;
            background: var(--color-white);
            padding: 2.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            border: 1px solid #eee;
        }

        .outlet-details h3 {
            font-size: 2rem;
            margin: 0 0 1rem 0;
            color: var(--color-primary-dark);
        }

        .location-text {
            color: var(--color-muted);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .status-badge {
            background-color: var(--color-primary-green);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.9rem;
            display: inline-block;
        }

        /* Tabs */
        .tabs-container {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .tab-button {
            padding: 0.75rem 2rem;
            border: 2px solid transparent;
            background: var(--color-bg-light);
            color: var(--color-muted);
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
        }

        .tab-button:hover {
            background: #e0e0e0;
            color: var(--color-primary-dark);
        }

        .tab-button.active {
            background: var(--color-primary-green);
            color: white;
            box-shadow: var(--shadow-sm);
        }

        /* Grid */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 2rem;
        }

        .no-products {
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem;
            color: var(--color-muted);
            font-style: italic;
        }

        .product-card {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
            display: flex;
            flex-direction: column;
        }

        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
            border-color: var(--color-primary-green);
        }

        .product-image-area {
            height: 220px;
            padding: 1.5rem;
            background: #fcfcfc;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .product-image-area img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
            transition: transform 0.3s;
        }

        .product-card:hover .product-image-area img {
            transform: scale(1.05);
        }

        .product-details {
            padding: 1.5rem;
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .product-name {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
            color: var(--color-primary-dark);
        }
        
        .product-type {
            font-size: 0.85rem;
            color: var(--color-muted);
            margin-bottom: 1rem;
        }

        .price-tag {
            margin-top: auto;
            background: var(--color-bg-light);
            padding: 0.75rem;
            border-radius: var(--radius-md);
            border: 1px solid #eee;
        }

        .price-label {
            display: block;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--color-muted);
            margin-bottom: 0.25rem;
        }

        .price-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-primary-green);
        }

        .view-map-btn {
            display: inline-block;
            margin-bottom: 1rem;
            color: var(--color-primary-green);
            text-decoration: none;
            font-weight: 600;
            border: 1px solid var(--color-primary-green);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            transition: all 0.2s;
        }

        .view-map-btn:hover {
            background: var(--color-primary-green);
            color: white;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
            .outlet-details {
                padding: 1.5rem;
            }
            .outlet-details h3 {
                font-size: 1.5rem;
            }
            
            /* Tabs Mobile */
            .tabs-container {
                flex-wrap: nowrap;
                overflow-x: auto;
                justify-content: flex-start;
                padding-bottom: 0.5rem; /* Space for scrollbar if any */
                -webkit-overflow-scrolling: touch;
            }
            .tab-button {
                padding: 0.5rem 1rem;
                white-space: nowrap;
                font-size: 0.9rem;
                flex-shrink: 0;
            }

            /* Products Grid Mobile - 3 Columns with reduced gap */
            .products-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 0.35rem; /* Tighter gap */
            }

            .product-card {
                border-radius: 6px;
                border: 1px solid #f0f0f0;
            }

            .product-image-area {
                height: 70px; /* Smaller image area */
                padding: 0.25rem;
                background: #fff;
            }
            
            .product-details {
                padding: 0.35rem; /* Tighter padding */
            }

            .product-name {
                font-size: 0.65rem; /* Smaller font */
                line-height: 1.1;
                margin-bottom: 0.1rem;
                height: 2.2em; /* Fixed height for 2 lines */
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .product-type {
                font-size: 0.55rem;
                margin-bottom: 0.2rem;
                display: none; /* Hide type to save space if needed, or keep very small */
            }

            .price-tag {
                padding: 0.15rem;
                background: transparent;
                border: none;
                margin-top: 0;
            }

            .price-label {
                font-size: 0.5rem;
                display: none; 
            }

            .price-value {
                font-size: 0.75rem;
                font-weight: 700;
            }
        }
      `}</style>
        </div>
    );
};

export default ProductDisplay;
