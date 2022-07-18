import React, { useContext } from 'react';
import checkboxesData from '../utils/checkboxes';
import Checkbox from './checkbox.component';
import { RolesContext } from "./update-profile.component";

const CheckboxContainer = props => {
    const context = useContext(RolesContext);
    const checkedRoles = new Map(context.roles);
    const disabled  = context.disabled;

    const handleChange = e => {
        if(disabled)
            e.preventDefault();
        const item = e.target.name;
        const isChecked = e.target.checked;
        checkedRoles.set(item, isChecked);
        props.onChange(checkedRoles);
    }
      
    return (
        <React.Fragment>
            {checkboxesData.map(data => (
                <Checkbox name={data.name} label={data.label} disabled={disabled}
                    key={data.name} checked={checkedRoles.get(data.name)} onChange={handleChange}
                />
            ))}
        </React.Fragment>
    )
    
   
}

export default CheckboxContainer;