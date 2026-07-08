import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ showTagline = false, size = 'sm', linkTo = '/', light = false, hideText = false }) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm', icon: 'text-xs', gap: 'gap-2' },
    md: { container: 'w-10 h-10', text: 'text-lg', icon: 'text-sm', gap: 'gap-2.5' },
    lg: { container: 'w-12 h-12', text: 'text-xl', icon: 'text-base', gap: 'gap-3' },
  };

  const s = sizes[size] || sizes.sm;

  const logoContent = (
    <div className={`flex items-center ${s.gap}`}>
      <div className={`${s.container} rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0`}>
        <svg viewBox="0 0 32 32" className={`${s.icon} w-full h-full p-1.5`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L4 9v6c0 7 5 13 12 15 7-2 12-8 12-15V9L16 2z" fill="currentColor" opacity="0.3" />
          <path d="M16 6L8 10.5V15c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V10.5L16 6z" fill="currentColor" opacity="0.5" />
          <path d="M12 14l4-3 4 3v4h-2v-3l-2-1.5L14 15v3h-2v-4z" fill="white" />
        </svg>
      </div>
      {!hideText && (
        <div>
          <div className={`${s.text} font-bold leading-tight`} style={{ color: light ? 'white' : linkTo === null ? 'white' : 'var(--text-primary)' }}>
            Smart Attendance System
          </div>
          {showTagline && (
            <div className="text-[10px] text-orange-400 leading-tight">Innovative Tech Solutions</div>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo === null) return logoContent;

  return <Link to={linkTo} className="hover:opacity-90 transition-opacity">{logoContent}</Link>;
}
