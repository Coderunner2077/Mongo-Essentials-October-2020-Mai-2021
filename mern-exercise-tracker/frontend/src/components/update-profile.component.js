import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import CheckboxContainer from './checkbox-container.component';

import RoleService from '../services/role.service';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import FormValidator from '../services/form-validator';

export const RolesContext = React.createContext();

export default class UpdateProfile extends Component {
    state = {
        username: '',
        email: "",
        password: '',
        newPassword: "",
        roles: [],
        message: "",
        successful: false,
        user: {},
        loading: false,
        isOwner: false,
        immutableRoles: false,
        hideRoles: false,
        forbidden: false
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

    onChangeNewPassword = e => {
        this.setState({
            newPassword: e.target.value
        });
    }

    componentDidMount() {   
        let isOwner = RoleService.isOwner(this.props.match.params.id);
        if(!isOwner && !RoleService.isAdmin()) {
            this.setState({ message: "You cannot update this user profile", success: false, forbidden: true });
            return;
        }
        
        this.setState({ isOwner });  
        UserService.getUser(this.props.match.params.id)
            .then(res => {
                let user = res.data;
                let currentUser = AuthService.getCurrentUser();  
                let immutableRoles = RoleService.isOwner(user._id)
                    || !currentUser.roles.includes("ROLE_ADMIN")
                    || currentUser.roles.includes("ROLE_ADMIN") && !isOwner
                    && user.roles.includes("admin");

                let hideRoles = !currentUser.roles.includes("ROLE_ADMIN") && !currentUser.roles.includes("ROLE_MODERATOR");
                
                this.setState({ user, username: user.username, email: user.email,
                    roles: [...user.roles], immutableRoles, hideRoles
                });
            })
            .catch(err => this.setState({ message: 
                err.message || err.toString()
            }));
       
    }

    renderRolesArray = () => {
        let roles = this.state.roles.map(role => [role, true ]);
        return roles;
    }

    onChangeRoles = checkedRoles => {
        const roles = [];
        for(const [role, checked] of checkedRoles)
            if(checked)
                roles.push(role);
        this.setState({ roles });
    }

    handleUpdate = e => {
        e.preventDefault();

        this.setState({ successful: false, message: "", loading: true });

        this.form.validateAll();

        if(this.checkBtn.context._errors.length === 0) {
            const { username, email, password, newPassword, roles, immutableRoles } = this.state;

            AuthService.updateUser(this.state.user.id, username, email, password, newPassword, immutableRoles ? null : roles)
                .then(response => 
                    this.setState({ successful: true, newPassword: "", 
                        message: response.data.message, loading: false })
                )
                .catch(err => 
                    this.setState({ loading: false, message:
                        (err.response && err.response.data && err.response.data.message) 
                            || err.message || err.toString()
                    })
                )
        } else
            this.setState({ loading: false });
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" 
                        alt="profile-image" className="profile-img-card"
                    />
                    <Form onSubmit={this.handleUpdate} ref={c => this.form = c}>
                        {!this.state.forbidden && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <Input type="text"
                                        id="username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        disabled={!this.state.isOwner}
                                        validations={[FormValidator.required, FormValidator.vusername]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input type="email"
                                        id="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        disabled={!this.state.isOwner}
                                        validations={[FormValidator.required, FormValidator.isEmail]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">
                                        {RoleService.isOwner(this.state.user.id) ? 
                                            "Current" : "Admin"} Password
                                    </label>
                                    <Input type="password"
                                        id="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[FormValidator.required, FormValidator.vpassword]}
                                    />
                                </div>
                                {RoleService.isOwner(this.state.user.id) && (
                                    <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <Input type="password"
                                        id="newPassword"
                                        value={this.state.newPassword}
                                        onChange={this.onChangeNewPassword}
                                        validations={[FormValidator.vnewpassword]}
                                    />
                                </div>
                                )}

                                {!this.state.hideRoles && (
                                    <fieldset className="form-group">
                                        <legend>{this.state.immutableRoles ? "Authorities" : "Select Roles"}</legend>
                                        <RolesContext.Provider value={ { roles: this.renderRolesArray(), disabled: this.state.immutableRoles }}>
                                            <CheckboxContainer onChange={this.onChangeRoles} />
                                        </RolesContext.Provider>
                                    </fieldset>
                                )}
                                <div className="form-group">
                                    <button className="btn btn-primary btn-block" disabled={this.state.loading}>
                                        {this.state.loading && (
                                            <span><span className="spinner-border spinner-border-sm"></span>{" "}</span>
                                        )}
                                        <span>Update</span>
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
                </div>
            </div>
        );
    }
}