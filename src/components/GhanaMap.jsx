import React from 'react';

const GhanaMap = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 500 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 20px 30px rgba(0, 135, 81, 0.15))' }}
        >
            {/* Abstract Stylized Shape of Ghana */}
            {/* This is a simplified artistic path - not geographically perfect but aesthetically pleasing for UI */}
            <path
                d="M180 750 
             C 100 740, 50 600, 60 550
             C 40 500, 20 450, 30 400
             C 40 300, 30 250, 50 200
             C 60 150, 100 100, 150 80
             C 200 60, 250 50, 300 60
             C 350 70, 400 100, 420 150
             C 440 200, 450 300, 440 350
             C 430 450, 450 550, 440 600
             C 430 650, 400 700, 350 730
             C 280 760, 220 760, 180 750
             Z"
                fill="url(#gradient)"
                stroke="white"
                strokeWidth="3"
            />

            {/* Regions or Points of Interest (Abstract) */}
            <circle cx="220" cy="650" r="5" fill="white" fillOpacity="0.8" /> {/* Accra area */}
            <circle cx="150" cy="500" r="4" fill="white" fillOpacity="0.6" />
            <circle cx="300" cy="400" r="4" fill="white" fillOpacity="0.6" />
            <circle cx="200" cy="200" r="4" fill="white" fillOpacity="0.6" />

            <defs>
                <linearGradient id="gradient" x1="250" y1="0" x2="250" y2="800" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#008751" />
                    <stop offset="1" stopColor="#006b3f" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default GhanaMap;
