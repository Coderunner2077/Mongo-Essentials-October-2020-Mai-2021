import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Exercise = props => {
    return <tr>
        <td>{props.exercise.username}</td>
        <td>{props.exercise.description.substring(0, 30)}{"..."}</td>
        <td>{props.exercise.duration}</td>
        <td>{props.exercise.date.substring(0,10)}</td>
        <td>
            <Link to={"/view/" + props.exercise.id }>View</Link>
            {props.isOwnerOrMod && (
                <div>
                    <Link to={"/edit/" + props.exercise.id}>Edit</Link> | 
                    <a href="#" onClick={() => props.onDelete(props.exercise.id)}>
                        Delete
                    </a>
                </div>
            )}
        </td>
    </tr>
}

Exercise.propTypes = {
    exercise: PropTypes.shape({
        username: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    isOwnerOrMod: PropTypes.bool
};

export default Exercise;