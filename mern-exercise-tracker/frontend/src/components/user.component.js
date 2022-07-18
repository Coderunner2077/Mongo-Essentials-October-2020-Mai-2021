import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const User = props => {
    return <tr>
        <td>{props.user.username}</td>
        <td>{props.user.email}</td>
        <td>
            <ul>
                {props.user.roles.map((role, index) => 
                    <li key={`${props.user.id}_${index}`}>
                        {typeof role.name === "string" ? 
                            role.name.charAt(0).toUpperCase() + role.name.slice(1) : role.name } Role
                    </li>
                )}
            </ul>
        </td>
        <td>
            <Link to={"/user/view/" + props.user.id }>View</Link>
            {props.isOwnerOrAdmin && (
                <div>
                    <Link to={"/user/update/" + props.user.id}>Update</Link> | 
                    <a href="#" onClick={() => props.onDelete(props.user.id)}>
                        Delete
                    </a>
                </div>
            )}
        </td>
    </tr>
}

User.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        roles: PropTypes.array.isRequired,
        id: PropTypes.string
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    isOwnerOrAdmin: PropTypes.bool
};

export default User;