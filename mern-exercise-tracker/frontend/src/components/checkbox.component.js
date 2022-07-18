import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ name, label, checked = false, onChange, disabled }) => {
    return (
        <div className="check-form">
            <input className="form-check-input" type="checkbox" name={name} 
                checked={checked} onChange={onChange} id={name} disabled={disabled}
            />
            <label className="form-check-label" htmlFor={name}>
                {label}
            </label>
        </div>
    )
}

Checkbox.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default Checkbox;