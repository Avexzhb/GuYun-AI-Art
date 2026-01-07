
import React from 'react';

interface BookmarkProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  position: 'left' | 'right';
}

const Bookmark: React.FC<BookmarkProps> = ({ label, isActive, onClick, position }) => {
  const isLeft = position === 'left';
  
  return (
    <div 
      onClick={onClick}
      className={`absolute top-20 cursor-pointer transition-all duration-500 z-30 flex items-center
        ${isLeft ? 'right-full' : 'left-full'}
      `}
    >
      <div className={`relative px-10 py-5 shadow-2xl transition-all duration-300 transform flex items-center justify-center overflow-hidden
        ${isActive ? 'scale-110 z-10 bg-[#8B0000] text-[#FFD700]' : 'hover:scale-105 opacity-90 bg-[#D4AF37] text-[#8B0000]'}
        ${isLeft ? 'rounded-l-2xl' : 'rounded-r-2xl'}
      `}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/silk.png')` }}></div>
        
        <div className="absolute top-0 left-0 right-0 h-1 opacity-20 bg-repeat-x pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q5 0 10 10 Q15 0 20 10' stroke='currentColor' fill='none'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-20 bg-repeat-x pointer-events-none rotate-180" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q5 0 10 10 Q15 0 20 10' stroke='currentColor' fill='none'/%3E%3C/svg%3E")` }}></div>

        <span className="font-bold text-2xl tracking-[0.2em] select-none chinese-font whitespace-nowrap z-10 relative">
          {label}
        </span>

        <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 border border-current rounded-full opacity-30
          ${isLeft ? 'left-2' : 'right-2'}
        `}></div>
      </div>
    </div>
  );
};

export default Bookmark;
