
import React from 'react';

interface BookmarkProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Bookmark: React.FC<BookmarkProps> = ({ label, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-300 flex items-center group
        ${isActive ? 'z-20' : 'z-10 hover:-translate-y-0.5'}
      `}
    >
      <div className={`relative px-6 py-2 shadow-lg transition-all duration-300 transform flex items-center justify-center overflow-hidden border-x border-[#8B0000]/20
        ${isActive 
          ? 'bg-[#8B0000] text-[#FFD700] scale-105 shadow-xl ring-1 ring-[#FFD700]/30' 
          : 'bg-[#D4AF37] text-[#8B0000] opacity-90 hover:opacity-100'
        }
      `}>
        {/* 丝绸纹理背景 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/silk.png')` }}></div>
        
        {/* 装饰边线 */}
        <div className="absolute top-0 left-0 right-0 h-0.5 opacity-30 bg-repeat-x pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='4' viewBox='0 0 10 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4 Q2.5 0 5 4 Q7.5 0 10 4' stroke='currentColor' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30 bg-repeat-x pointer-events-none rotate-180" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='4' viewBox='0 0 10 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4 Q2.5 0 5 4 Q7.5 0 10 4' stroke='currentColor' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")` }}></div>

        <span className="font-bold text-sm tracking-[0.1em] select-none chinese-font whitespace-nowrap z-10 relative">
          {label}
        </span>

        {/* 装饰小孔 */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-1.5 h-1.5 border border-current rounded-full opacity-20"></div>
        <div className="absolute top-1/2 -translate-y-1/2 right-1.5 w-1.5 h-1.5 border border-current rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default Bookmark;
