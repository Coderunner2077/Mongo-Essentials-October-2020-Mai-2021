import { Component } from 'react';
import { Link } from 'react-router-dom';

import RoleService from '../services/role.service';
import ExerciseService from '../services/exercise.service';

export default class ViewExercise extends Component {
    state = {
        exercise: {},
        message: "",
        isOwnerOrMod: false, 
        success: false
    }

    componentDidMount() {
        ExerciseService.getOne(this.props.match.params.id)
            .then(res => {                
                this.setState({ exercise: res.data, 
                    isOwnerOrMod: RoleService.isOwnerOrMod(res.data.user)
                });
            })
            .catch(err => {
                this.setState({ message:
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                });
            })
    }

    handleDelete = e => {
        e.preventDefault();
        ExerciseService.deleteExercise(this.state.exercise.id)
            .then(res => {
                this.setState({ success: true, message: res.status === 204 ? "Exercise deleted!" : res.data.message });
                setTimeout(() => {
                    this.props.history.push("/exercises");
                }, 4000);
            })
            .catch(err => {
                this.setState({ success: false, message:
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                })
            })
    }

    render() {
        const { exercise, message, success, isOwnerOrMod } = this.state;
        const { username, description, duration, date, user } = exercise;
        return (
            <div className="container">
                <div className="jumbotron">
                    {!message && (
                        <div>
                            <h3>Exercise created by <strong>{username}</strong></h3>
                            <p className="form-group">
                                <strong>Description:</strong><br />
                                {description}
                            </p>
                            <p className="form-group">
                                <strong>Duration:</strong>{" "}
                                <span>{duration} min</span>
                            </p>
                            <p className="form-group">
                                <strong>Date:</strong>{" "}
                                <span>{date ? date.substring(0, 10) : ""}</span>
                            </p>
                            {isOwnerOrMod && (
                                <div className="form-group">
                                    <Link to={`/edit/${exercise.id}`} className="btn btn-primary">Edit</Link>
                                    <a href="/delete" onClick={this.handleDelete} 
                                        className="btn btn-danger">Delete</a>
                                </div>
                            )}
                        </div>
                    )}
                    {message && (
                        <div className={
                            `alert alert-${success ? "success" : "danger"}`
                        }  role="alert">
                            { message }
                        </div>
                    )}
                </div>
            </div>
        );
    }
}