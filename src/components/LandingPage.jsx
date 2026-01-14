import React from 'react';

const LandingPage = ({ onEnter }) => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="logo-wrapper">
                    <img src="/favicon.png" alt="ABL Logo" className="landing-logo" />
                </div>

                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="icon-wrapper">
                            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <h3>Right Place</h3>
                    </div>

                    <div className="divider"></div>

                    <div className="feature-card">
                        <div className="icon-wrapper">
                            {/* Custom Cedi Sign SVG */}
                            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 7 A 7 7 0 1 0 17 17" />
                                <path d="M10 3 V 21" />
                            </svg>
                        </div>
                        <h3>Right Price</h3>
                    </div>
                </div>

                <div className="sub-headline">
                    YOUR PREFERRED BRANDS AT THE RIGHT PRICE
                </div>

                <button className="enter-button" onClick={onEnter}>
                    ENTER PORTAL
                </button>
            </div>

            <style>{`
        .landing-container {
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--color-white);
            background-image: linear-gradient(135deg, rgba(0, 135, 81, 0.05) 0%, rgba(255,255,255,0) 100%);
            overflow: hidden;
            font-family: 'Inter', sans-serif;
        }

        .landing-content {
            text-align: center;
            padding: 2rem;
            max-width: 900px;
            width: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: fadeIn 0.8s ease-out;
        }

        .logo-wrapper {
            margin-bottom: 3rem;
             animation: float 6s ease-in-out infinite;
        }

        .landing-logo {
            width: 350px; /* Increased Size */
            height: auto;
            max-width: 90vw;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        .feature-cards {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 3rem;
            background: white;
            padding: 2rem 4rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
            border: 1px solid rgba(0,0,0,0.02);
            transition: transform 0.3s ease;
        }
        
        .feature-cards:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.08);
        }

        .feature-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .icon-wrapper {
            background: rgba(0, 135, 81, 0.1);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            color: var(--color-primary-green);
            transition: all 0.3s ease;
        }
        
        .feature-card:hover .icon-wrapper {
            background: var(--color-primary-green);
            color: white;
            transform: scale(1.1);
        }

        .feature-icon {
            width: 40px;
            height: 40px;
        }

        .feature-card h3 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
            white-space: nowrap;
        }

        .divider {
            width: 1px;
            height: 100px;
            background: #eee;
            margin: 0 1.5rem;
        }

        .sub-headline {
            font-size: 1.15rem;
            color: #7f8c8d;
            margin-bottom: 3rem;
            font-weight: 600;
            letter-spacing: 3px;
        }

        .enter-button {
            background-color: var(--color-primary-green);
            color: white;
            border: none;
            padding: 1.25rem 5rem;
            font-size: 1.25rem;
            font-weight: 700;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 20px rgba(0, 135, 81, 0.3);
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .enter-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(0, 135, 81, 0.4);
            background-color: #006838;
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
            .feature-cards {
                flex-direction: column;
                padding: 2rem;
                gap: 2rem;
            }
            .divider {
                width: 100px;
                height: 1px;
                margin: 0;
            }
            .landing-logo {
                width: 250px;
            }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
