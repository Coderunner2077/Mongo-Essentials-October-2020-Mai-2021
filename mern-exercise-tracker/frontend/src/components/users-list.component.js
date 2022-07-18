import React, { Component } from 'react';
import User from './user.component';

import UserService from '../services/user.service';
import RoleService from '../services/role.service';
import AuthService from '../services/auth.service';

export default class UsersList extends Component {
    state = {
        users: [],
        message: "",
        success: true
    }

    componentDidMount() {
        UserService.getUsers()
            .then(res => {
                this.setState({ users: res.data, message: "" });
            })
            .catch(err => {
                console.log(JSON.stringify(err.response.data));
                this.setState({ success: false, message: 
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || toString()
                });
            })
    }

    deleteUser = id => {
        AuthService.deleteUser(id)
            .then(res => {
                this.setState({ success: true, message: 
                        res.status === 204 ? 'User deleted!' : res.data.message,
                    users: this.state.users.filter(user => user.id !== id)
                });
            })
            .catch(err => {
                this.setState({ success: false, message: 
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                });
            })
    }

    usersList() {
        return this.state.users.map(currentUser => {
            return <User user={currentUser} key={currentUser.id}
                onDelete={this.deleteUser}
                isOwnerOrAdmin={RoleService.isOwnerOrAdmin(currentUser.id)} />
        });
    }

    render() {
        return (
            <div className="col-md-12">
                <h3>List of Users</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.usersList() }
                    </tbody>
                </table>
                <p>You are on the Users List component!</p>
                {this.state.message && (
                    <div className="form-group">
                        <div className={
                            `alert alert-${this.state.success ? "success" : "danger"}`
                        } role="alert">
                            {this.state.message}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}