import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={fullWidth ? { width: '100%' } : {}}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
