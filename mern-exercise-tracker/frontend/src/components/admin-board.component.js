//import RoleService from '../services/role.service';
import UserService from '../services/user.service';

import { useState, useEffect } from 'react';

const AdminBoard = props => {
    //const [admin, setAdmin] = useState(RoleService.getCurrentUser());
    const [message, setMessage] = useState("");

    useEffect(() => {
        UserService.getAdminBoard()
            .then(res => setMessage(res.data))
            .catch(err => setMessage(
                (err.response && err.response.data && err.response.data.message)
                    || err.message || err.toString()
            ));
    }, []);

    return (
        <div className="jumbotron">
            <h3>{message}</h3>
        </div>
    );
}

export default AdminBoard;