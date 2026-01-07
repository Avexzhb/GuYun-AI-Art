
import React from 'react';

export const CLOUD_PATTERN_SVG = (
  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 pointer-events-none opacity-20">
    <defs>
      <pattern id="cloudPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M10,2 Q13,2 15,4 Q17,6 15,8 Q13,10 10,10 Q7,10 5,8 Q3,6 5,4 Q7,2 10,2 M5,6 Q2,6 0,8" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#cloudPattern)" />
  </svg>
);

export const CORNER_DECORATION = (
  <svg width="60" height="60" viewBox="0 0 100 100" className="text-red-800">
    <path d="M0,0 L40,0 Q50,0 50,10 L50,40 Q50,50 40,50 L0,50 Z" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="25" cy="25" r="10" fill="currentColor" opacity="0.6" />
  </svg>
);
