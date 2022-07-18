import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExerciseService from '../services/exercise.service';
import Form from "react-validation/build/form";
import Textarea from "react-validation/build/textarea";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from '../services/auth.service';

import FormValidator from '../services/form-validator';

export default class CreateExercise extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            duration: '',
            date: new Date(),
            user: {},
            message: "",
            exerciseId: ""
        }
    }

    onChangeDescription = (e) => {
        this.setState({ description: e.target.value });
    }

    onChangeDuration = (e) => {
        this.setState({ duration: e.target.value });
    }

    onChangeDate = date => {
        this.setState({ date: date });
    }

    onSubmit = e => {
        e.preventDefault();

        this.form.validateAll();
        this.setState({ message: "", exercise: ""});
        if(this.checkBtn.context._errors.length === 0) {
            let exo = {
                username: this.state.user.username,
                description: this.state.description,
                duration: this.state.duration,
                date: this.state.date,
                user: this.state.user.userId
            };
    
            ExerciseService.createExercise(exo.username, exo.description, exo.duration, exo.date, exo.user)
                .then(res => {
                    this.setState({ message: res.data.message, 
                        exerciseId: res.data.id
                    });
                })
                .catch(err => {
                    this.setState({
                        message: (err.response && err.response.data && err.response.data.message)
                            || err.message || err.toString()
                    });
                });
        }
       
    }

    componentDidMount() {
        let user = AuthService.getCurrentUser();
        if(!user) {
            this.props.history.push("/signin");
        }
        this.setState({ user });
    }

    onReload = e => {
        this.setState({
            description: '',
            duration: '',
            date: new Date(),
            user: {},
            message: "",
            exercise: ""
        });
        window.location.reload();
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <h3>Create New Exercise Log</h3>
                    <Form onSubmit={this.onSubmit} ref={c => this.form = c }>
                        {!this.state.exercise && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="description">
                                        Description
                                    </label>
                                    <Textarea className="form-control"
                                        value={this.state.description}
                                        onChange={this.onChangeDescription}
                                        id="description"
                                        validators={[FormValidator.required]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="duration">
                                        Duration
                                    </label>
                                    <Input className="form-control"
                                        id="duration"
                                        type="number"
                                        value={this.state.duration}
                                        onChange={this.onChangeDuration}
                                        validators={[FormValidator.required, FormValidator.vduration]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date">Date</label>
                                    <div>
                                        <DatePicker selected={this.state.date}
                                            onChange={this.onChangeDate}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <button className="btn btn-primary">Create</button>

                                {this.state.message && (
                                    <div className={
                                        `alert alert-${this.state.exerciseId ? "success" : "danger"}`} 
                                        role="alert">
                                        {this.state.message}
                                    </div>
                                )}
                            </div>
                        )}
                        <CheckButton style={{ display: "none" }}
                            ref={c => this.checkBtn = c }
                        />
                    </Form>
                    {this.state.exerciseId && (
                        <div>
                            <Link to={`/view/${this.state.exerciseId}`}>
                                View the exercise
                            </Link>
                            <button className="btn btn-primary" onClick={this.onReload}>
                                Create another exercise
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}