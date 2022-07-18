import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Form from 'react-validation/build/form';
import Textarea from 'react-validation/build/textarea';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';

import FormValidator from '../services/form-validator';
import AuthService from '../services/auth.service';
import ExerciseService from '../services/exercise.service';


export default class EditExercise extends Component {
    state = {
        id: "",
        username: "",
        description: "",
        date: new Date(),
        duration: 0,
        user: "",
        successful: false,
        message: ""
    }

    onChangeDescription = e => {
        this.setState({ description: e.target.value });
    }

    onChangeDuration = e => {
        this.setState({ duration: e.target.value });
    }

    onChangeDate = date => {
        this.setState({ date: date });
    }        

    onSubmit = e => {
        e.preventDefault();

        this.setState({ message: "" });
        this.form.validateAll();

        if(this.checkBtn.context._errors.length === 0) {
            const { id, description, duration, date } = this.state;
           
            ExerciseService.updateExercise(id, description, duration, date)
                .then(res => 
                    this.setState({ successful: true, message: res.data.message })
                    
                )
                .catch(err => 
                    this.setState({ successful: false, message:
                        (err.response && err.response.data && err.response.data.message) 
                            || err.message || err.toString()
                    })
                );
        }
    }

    componentDidMount() {
        ExerciseService.getOne(this.props.match.params.id)
            .then(res => {
                this.setState({
                    id: res.data.id,
                    username: res.data.username,
                    description: res.data.description,
                    duration: res.data.duration,
                    date: Date.parse(res.data.date),
                    user: res.data.user
                });
            })
            .catch(err => {
                this.setState({ successful: false, message: 
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                });
            })
    }

    render() {
        const { id, username, description, duration, date } = this.state;
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <h3>Edit Exercise Log</h3>
                    <Form onSubmit={this.onSubmit} ref={c => this.form = c}>
                        <div className="form-group">
                            <label htmlFor="username">Username: </label>
                            <Input type="text" id="username"
                                disabled={true}
                                className="form-control"
                                value={username}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description: </label>
                            <Textarea id="description"
                                className="form-control"
                                value={description}
                                onChange={this.onChangeDescription}
                                validations={[FormValidator.required]}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration (in min): </label>
                            <Input type="number" id="duration"
                                className="form-control"
                                required
                                value={duration}
                                onChange={this.onChangeDuration}
                                validations={[FormValidator.required, FormValidator.vduration]}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date: </label>
                            <div>
                                <DatePicker 
                                    selected={date} 
                                    onChange={this.onChangeDate}
                                    id="date"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">
                                Edit
                            </button>
                        </div>
                        <CheckButton style={{ display: "none" }} ref={c => this.checkBtn = c } />
                        {this.state.message && (
                            <div>
                                <div className={
                                    `alert alert-${this.state.successful ? "success" : "danger" }`
                                } role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        {this.state.successful && (
                            <div className="form-group">
                                <Link to={`/view/${id}`} className="btn btn-success btn-block">
                                    Display Exercise
                                </Link>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        );
    }
}