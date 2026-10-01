import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style = {},
}) => {
  const variantClass = `badge-${variant.toLowerCase()}`;
  return (
    <span
      className={`badge ${variantClass} ${className}`}
      style={{
        fontSize: size === 'sm' ? '0.7rem' : 'var(--font-size-xs)',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
