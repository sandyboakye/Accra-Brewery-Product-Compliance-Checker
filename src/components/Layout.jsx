import React from 'react';

const Layout = ({ children, title = "Price Compliance", contentTitle, onBack, onHome }) => {
  return (
    <div className="layout-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">Right place, right price</h1>
          </div>
          {onHome && (
            <button onClick={onHome} className="home-button" aria-label="Go Home" title="Return to Home">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="home-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {contentTitle && (
          <div className="page-header">
            {onBack && (
              <button onClick={onBack} className="back-button">
                &larr; Back
              </button>
            )}
            <h2 className="content-title">{contentTitle}</h2>
          </div>
        )}
        {children}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} ABL Price Compliance Checker</p>
      </footer>

      <style>{`
        .layout-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding-bottom: 60px; /* Ensure content isn't hidden behind fixed footer */
        }

        .app-header {
          background-color: var(--color-white);
          border-bottom: 5px solid var(--color-primary-yellow);
          padding: 1rem 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .header-content {
          width: 100%;
          padding: 0 1rem; /* Add side padding */
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .app-icon {
          width: 32px;
          height: 32px;
        }

        .app-title {
          font-size: 1.25rem;
          color: var(--color-primary-green);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .main-content {
          flex: 1;
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }



        /* ... existing styles ... */

        .app-footer {
          background-color: var(--color-primary-green);
          color: var(--color-white);
          text-align: center;
          padding: 1rem;
          /* Fixed positioning */
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          font-size: 0.875rem;
          margin-top: 0;
        }

        .page-header {
           display: flex;
           align-items: center;
           gap: 1rem;
           margin-bottom: 2rem;
        }

        .back-button {
           background: none;
           border: 1px solid var(--color-text-dark);
           padding: 0.5rem 1rem;
           border-radius: var(--radius-md);
           transition: all 0.2s;
        }
        
        .back-button:hover {
           background: var(--color-text-dark);
           color: var(--color-white);
        }

        .content-title {
           margin: 0;
           font-size: 1.5rem;
           color: var(--color-text-dark);
        }

        .home-button {
            background: transparent;
            border: 1px solid transparent;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: var(--radius-md);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-text-dark); /* Use dark text color for neutral look */
            opacity: 0.7;
        }

        .home-button:hover {
            opacity: 1;
            background-color: var(--color-bg-light);
            border-color: #eee;
            color: var(--color-primary-green);
        }

        .home-icon {
            width: 20px;
            height: 20px;
        }

        @media (max-width: 600px) {
            .app-header {
                padding: 0.75rem 1rem;
            }
            .header-content {
                padding: 0;
            }
            .app-title {
                font-size: 1rem;
            }
            .app-icon {
                width: 24px;
                height: 24px;
            }
            .page-header {
                margin-bottom: 1rem;
                gap: 0.5rem;
            }
            .back-button {
                padding: 0.4rem 0.8rem;
                font-size: 0.9rem;
            }
            .content-title {
                font-size: 1.2rem;
            }
        }
      `}</style>
    </div>
  );
};

export default Layout;
