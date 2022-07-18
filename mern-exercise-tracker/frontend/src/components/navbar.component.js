import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import RoleService from '../services/role.service';

export default class Navbar extends Component {
    state ={
        user: undefined,
        isAuthenticated: false,
        isMod: false,
        isAdmin: false,
        loggedOut: false
    }

    componentDidMount() {
        this.setState({
            user: RoleService.getCurrentUser(),
            isAuthenticated: RoleService.isAuthenticated(),
            isMod: RoleService.isModerator(),
            isAdmin: RoleService.isAdmin()
        });
    }

    logOut = e => {
        e.preventDefault();
        RoleService.logOut();
        this.setState({ loggedOut: true, user: RoleService.getCurrentUser(),
            isAuthenticated: RoleService.isAuthenticated(),
            isMod: RoleService.isModerator(),
            isAdmin: RoleService.isAdmin()});
    }

    render() {
        const { user, isAuthenticated, isMod, isAdmin } = this.state;

        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">Exercise Tracker</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/exercises" className="nav-link">Exercises</Link>
                        </li>
                        {isAuthenticated && (
                            <li className="navbar-item">
                                <Link to="/create" className="nav-link">Create Exercise</Link>
                            </li>
                        )}
                    </ul>
                    {isAuthenticated && (
                        <div className="navbar-nav ml-auto">
                            {isMod && (
                                <li className="navbar-item">
                                    <Link to="/mod" className="nav-link">Moderator Board</Link>
                                </li>
                            )}
                            {isAdmin && (
                                <li className="navbar-item">
                                    <Link to="/admin" className="nav-link">Admin Board</Link>
                                </li>
                            )}
                            <li className="navbar-item">
                                <Link to="/users" className="nav-link">Users List</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/profile" className="nav-link">
                                    {user.username}
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <a href="/logout" className="nav-link" onClick={this.logOut}>Log out</a>
                            </li>
                        </div>
                    )}
                    {!isAuthenticated && (
                        <div className="navbar-nav ml-auto">
                            <li className="navbar-item">
                                <Link to="/signup" className="nav-link">Sign up</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/login" className="nav-link">Sign in</Link>
                            </li>
                        </div>
                    )}
                    {this.state.loggedOut && (
                        <Redirect to="/" />
                    )}
                </div>
            </nav>
        );
    }
}