import { isEmail } from 'validator';

class FormValidator {
    required = value => {
        if(!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    This field is required
                </div>
            )
        }
    }

    isEmail = value => {
        if(!isEmail(value))
            return (
                <div className="alert alert-danger" role="alert">
                    This is not a valid email
                </div>
            );
    }

    vusername = value => {
        if(value.length < 3 || value.length > 20)
            return (
                <div className="alert alert-danger" role="alert">
                    Username must be between 3 and 20 characters
                </div>
            )
    }

    vpassword = value => {
        if(value.length < 6 || value.length > 40)
            return (
                <div className="alert alert-danger" role="alert">
                    Password must be between 6 and 40 characters
                </div>
            )
    }

    vduration = value => {
        if(isNaN(value) || value <= 0 || value > 1440)
            return (
                <div className="alert alert-danger" role="alert">
                    This is not a valid number of minutes
                </div>
            )
    }

    vnewpassword = value => {
        if(value && (value.length < 6 || value.length > 40))
            return (
                <div className="alert alert-danger" role="alert">
                    Password must be between 6 and 40 characters
                </div>
            );
    }
}

export default new FormValidator();