import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';

import AuthService from '../services/auth.service';
import FormValidator from '../services/form-validator';

export default class Login extends Component {
    state = {
        username: "",
        password: "",
        loading: false,
        message: ""
    }

    onChangeUsername = e => {
        this.setState({ username: e.target.value });
    }

    onChangePassword = e => {
        this.setState({ password: e.target.value });
    }

    handleLogin = e => {
        e.preventDefault();

        this.setState({ loading: true, message: "" });
        this.form.validateAll();

        if(this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password)
                .then(res => {
                    this.props.history.push("/profile");
                    window.location.reload();                    
                })
                .catch(err => {
                    this.setState({ loading: false, message:
                        (err.response && err.response.data && err.response.data.message)
                         || err.message || err.toString()
                    });
                })
        } else
            this.setState({ loading: false });

    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        className="profile-img-card"
                        alt="profile-image"
                    />

                    <Form onSubmit={this.handleLogin} ref={c => this.form = c}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Input type="text"
                                className="form-control"
                                name="username"
                                value={this.state.username}
                                onChange={this.onChangeUsername}
                                validations={[FormValidator.required, FormValidator.vusername]}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Input type="password"
                                name="password"
                                className="form-control"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                                validations={[FormValidator.required, FormValidator.vpassword]}
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" disabled={this.state.loading}>
                                {this.state.loading && (
                                    <span><span className="spinner-border spinner-border-sm"></span>{" "}</span>
                                )}
                                <span>Sign In</span>
                            </button>
                        </div>
                        <CheckButton style={{ display: "none"}} ref={c => this.checkBtn = c} />
                        {this.state.message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        );
    }
}