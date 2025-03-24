import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, children, type = 'primary', className = '', disabled = false }) => {
  const baseClass = 'button';
  const typeClass = type === 'primary' ? '' : ` button-${type}`;
  const customClass = className ? ` ${className}` : '';

  return (
    <button
      onClick={onClick}
      className={`${baseClass}${typeClass}${customClass}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button;