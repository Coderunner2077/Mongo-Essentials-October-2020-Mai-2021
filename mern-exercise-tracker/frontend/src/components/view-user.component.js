import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthService from '../services/auth.service';
import RoleService from '../services/role.service';
import UserService from '../services/user.service';

export default class ViewUser extends Component {
    state = {
        user: {},
        currentUser: AuthService.getCurrentUser(),
        isOwnerOrAdmin: false,
        message: ""
    }

    componentDidMount() {
        UserService.getUser(this.props.match.params.id)
            .then(res => {
                this.setState({ user: res.data, isOwnerOrAdmin:
                    RoleService.isOwnerOrAdmin(res.data.id)
                });
            })
            .catch(err => 
                this.setState({ message: 
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                })
            );
    }

    handleDelete = e => {
        e.preventDefault();
        AuthService.deleteUser(this.state.user.id)
            .then(res => {
                this.setState({ message: res.data });
            })
            .catch(err => {
                this.setState({ message:
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                })
            })
    }

    render() {
        const { user, isOwnerOrAdmin, message } = this.state;

        return (
            <div className="container">
                <div className="jumbotron">
                    {!this.state.message && (
                        <div>
                            <p>
                                <strong>{user.username}</strong> Profile
                            </p>
                            <p>
                                <strong>Id:</strong>{" "}
                                {user.id}
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                {user.email}
                            </p>
                            <strong>Authorities:</strong>
                            <ul>
                                {user.roles && 
                                    user.roles.map((role, index) => 
                                        <li key={index}>{role.toUpperCase()} Role</li>
                                )}
                            </ul>
                            {isOwnerOrAdmin && (
                                <div className="btn-group">
                                    <div className="form-group">
                                        <Link to={`/user/update/${user.id}`} className="btn btn-primary">Update</Link>
                                    </div>
                                    <div className="form-group">
                                        <a href="/delete" className="btn btn-danger" onClick={this.handleDelete}>Delete</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {message && (
                        <div className="alert alert-danger" role="alert">
                            { message }
                        </div>
                    )}
                </div>
            </div>
        );
    }
}