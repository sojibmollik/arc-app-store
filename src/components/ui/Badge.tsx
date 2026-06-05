import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'violet' | 'cyan' | 'pink' | 'slate' | 'success' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200';
  
  const variants = {
    violet: 'bg-brand-violet/10 text-violet-400 border-brand-violet/20 hover:bg-brand-violet/20',
    cyan: 'bg-brand-cyan/10 text-cyan-400 border-brand-cyan/20 hover:bg-brand-cyan/20',
    pink: 'bg-brand-pink/10 text-pink-400 border-brand-pink/20 hover:bg-brand-pink/20',
    slate: 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-800',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
