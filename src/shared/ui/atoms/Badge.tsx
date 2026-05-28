import React from 'react';

interface BadgeProps {
  className?: string;
  variant?: 'green' | 'yellow' | 'red' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'neutral',
  children,
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
