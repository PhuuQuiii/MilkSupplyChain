import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const Link = ({ to, children, className = '', type = 'primary' }) => {
  const baseClass = 'nav-link';
  const typeClass = type === 'primary' ? '' : ` nav-link-${type}`;
  const customClass = className ? ` ${className}` : '';

  return (
    <RouterLink
      to={to}
      className={`${baseClass}${typeClass}${customClass}`}
    >
      {children}
    </RouterLink>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary'])
};

export default Link;