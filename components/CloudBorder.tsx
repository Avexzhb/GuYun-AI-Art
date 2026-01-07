
import React from 'react';

const CloudBorder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative p-8 border-2 border-[#8B0000] rounded-lg bg-white shadow-2xl w-full h-full flex flex-col">
      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#8B0000]"></div>
      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#8B0000]"></div>
      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#8B0000]"></div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#8B0000]"></div>
      
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/handmade-paper.png')` }}></div>

      <div className="relative z-10 flex-1 flex items-center justify-center min-h-[300px]">
        {children}
      </div>

      <div className="absolute top-2 left-2 text-[#8B0000] opacity-20 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5,19c-0.1,0-0.2,0-0.3,0c-0.4,1.2-1.5,2-2.7,2c-0.6,0-1.1-0.2-1.5-0.5c-0.7,0.3-1.4,0.5-2.2,0.5c-2.4,0-4.4-1.8-4.7-4.1 C4.4,16.5,3,15,3,13c0-2.2,1.8-4,4-4c0.1,0,0.2,0,0.3,0C8.1,6.8,10.1,5,12.5,5c2.4,0,4.4,1.8,4.7,4.1c0.1,0,0.2,0,0.3,0 c2.2,0,4,1.8,4,4C21.5,15.3,19.7,17.1,17.5,19z"/></svg>
      </div>
      <div className="absolute bottom-2 right-2 text-[#8B0000] opacity-20 pointer-events-none rotate-180">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5,19c-0.1,0-0.2,0-0.3,0c-0.4,1.2-1.5,2-2.7,2c-0.6,0-1.1-0.2-1.5-0.5c-0.7,0.3-1.4,0.5-2.2,0.5c-2.4,0-4.4-1.8-4.7-4.1 C4.4,16.5,3,15,3,13c0-2.2,1.8-4,4-4c0.1,0,0.2,0,0.3,0C8.1,6.8,10.1,5,12.5,5c2.4,0,4.4,1.8,4.7,4.1c0.1,0,0.2,0,0.3,0 c2.2,0,4,1.8,4,4C21.5,15.3,19.7,17.1,17.5,19z"/></svg>
      </div>
    </div>
  );
};

export default CloudBorder;
