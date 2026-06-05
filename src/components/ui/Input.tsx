import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full glass-panel px-4 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 outline-none transition-all duration-200 neon-border-violet ${
            error ? 'border-brand-pink/50 focus:border-brand-pink focus:ring-brand-pink/50' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-brand-pink mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', rows = 4, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full glass-panel px-4 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 outline-none transition-all duration-200 neon-border-violet ${
            error ? 'border-brand-pink/50 focus:border-brand-pink focus:ring-brand-pink/50' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-brand-pink mt-0.5">{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full glass-panel px-4 py-2.5 rounded-lg text-sm text-slate-100 bg-brand-bg/90 appearance-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet/50 outline-none transition-all duration-200 neon-border-violet cursor-pointer ${
              error ? 'border-brand-pink/50 focus:border-brand-pink' : ''
            } ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-brand-card text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-brand-pink mt-0.5">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
