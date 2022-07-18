import { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthService from '../services/auth.service';

export default class Profile extends Component {
    state = {
        currentUser: AuthService.getCurrentUser()
    }

    render() {
        const { currentUser } = this.state;

        return !currentUser ?
            (
                <div className="jumbotron">
                    <div className="alert alert-danger" role="alert">
                        You have to sign in to view this page
                    </div>
                    <div>
                        <Link to="/login">Sign in now!</Link>
                    </div>
                </div>
            ) :
            (
                <div className="jumbotron">
                    <p>
                        <strong>{currentUser.username}</strong> Profile
                    </p>
                    <p>
                        <strong>Token:</strong>{" "}
                        {currentUser.accessToken.substring(0,40)}...{""}
                        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                    </p>
                    <p>
                        <strong>Id:</strong>{" "}
                        {currentUser.id}
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        {currentUser.email}
                    </p>
                    <p>
                        <strong>Token expires in:</strong>{" "}
                        {Math.round((currentUser.expiresIn * 1000 - (Date.now() - currentUser.signedAt)) / 1000 / 60)} min
                    </p>
                    <strong>Authorities:</strong>
                    <ul>
                        {currentUser.roles && 
                            currentUser.roles.map((role, index) => 
                                <li key={index}>{role}</li>
                        )}
                    </ul>
                    <div className="form-group">
                        <Link to={`/user/update/${currentUser.id}`} className="btn btn-primary">Update</Link>
                    </div>
                </div>
        );
    }
}