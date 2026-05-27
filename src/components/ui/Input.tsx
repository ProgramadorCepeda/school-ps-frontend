import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="input-container">
        {label && (
          <label className="input-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${className}`}
          {...props}
        />
        {error && (
          <p className="input-error-text">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
