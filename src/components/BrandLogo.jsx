import React from 'react';

const BrandLogo = ({ className = '', size = 48, title = 'Aditya portfolio logo' }) => (
  <img
    className={className}
    src="/brand-logo.png"
    width={size}
    height={size}
    alt={title}
    decoding="async"
    draggable="false"
    style={{
      width: size,
      height: size,
      objectFit: 'contain',
      display: 'block',
      userSelect: 'none',
    }}
  />
);

export default BrandLogo;
