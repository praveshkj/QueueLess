import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger
  size = 'md',        // sm, md, lg
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  id,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const widthClass = fullWidth ? 'btn-full' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      id={id}
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner spinner-sm" style={{ marginRight: '0.5rem' }} />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
