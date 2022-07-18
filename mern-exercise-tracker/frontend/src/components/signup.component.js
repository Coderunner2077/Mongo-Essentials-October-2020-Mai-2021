import React, { Component } from 'react';
import AuthService from '../services/auth.service';
import FormValidator from '../services/form-validator';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import { Link } from 'react-router-dom';

export default class Signup extends Component {
    state = {
        username: '',
        email: "",
        password: '',
        message: "",
        successful: false
    }

    onChangeUsername = e => {
        this.setState({
            username: e.target.value
        });
    }

    onChangeEmail = e => {
        this.setState({ email: e.target.value });
    }

    onChangePassword = e => {
        this.setState({
            password: e.target.value
        });
    }

    handleRegister = e => {
        e.preventDefault();

        this.setState({ successful: false, message: "" });

        this.form.validateAll();

        if(this.checkBtn.context._errors.length === 0) {
            const { username, email, password } = this.state;

            console.log("email : " + email);
            AuthService.register(username, email, password)
                .then(res => {
                    this.setState({ successful: true, message: res.data.message });
                })
                .catch(err => {
                    this.setState({ message:
                        (err.response && err.response.data && err.response.data.message) 
                            || err.message || err.toString()
                    });
                })
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" 
                        alt="profile-image" className="profile-img-card"
                    />
                    <Form onSubmit={this.handleRegister} ref={c => this.form = c}>
                        {!this.state.successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <Input type="text"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validations={[FormValidator.required, FormValidator.vusername]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input type="email"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[FormValidator.required, FormValidator.isEmail]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Input type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[FormValidator.required, FormValidator.vpassword]}
                                    />
                                </div>  
                                <div className="form-group">
                                    <button className="btn btn-primary btn-block">
                                        <span>Sign Up</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        {this.state.message && (
                            <div className="form-group">
                                <div className={
                                    `alert alert-${this.state.successful ? "success" : "danger"}`}
                                    role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton style={{ display: "none" }}
                            ref={c => this.checkBtn = c}
                        />
                    </Form>
                    {this.state.successful && (
                        <div>
                            <Link to="/login">Sign in now!</Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}