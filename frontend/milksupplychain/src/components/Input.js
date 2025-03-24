import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  label,
  required = false,
  error = '',
  className = ''
}) => {
  const inputClass = `form-control${error ? ' error' : ''}${className ? ` ${className}` : ''}`;

  return (
    <div className="form-group">
      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
        required={required}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'number', 'password', 'email']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default Input;