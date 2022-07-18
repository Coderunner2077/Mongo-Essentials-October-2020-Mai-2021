import React, { Component } from 'react';
import Exercise from './exercise.component';

import ExerciseService from '../services/exercise.service';
import RoleService from '../services/role.service';

export default class ExercisesList extends Component {
    state = {
        exercises: [],
        message: "",
        success: true
    }

    componentDidMount() {
        ExerciseService.getAllExercises()
            .then(res => {
                this.setState({ exercises: res.data, message: "" });
            })
            .catch(err => {
                this.setState({ success: false, message: 
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                });
            })
    }

    deleteExercise = id => {
        ExerciseService.deleteExercise(id)
            .then(res => 
                this.setState({ success: true, message: 
                    res.status === 204 ? "Exercise deleted!" : res.data.message,
                    exercises: this.state.exercises.filter(exercise => exercise.id !== id)
                })
            )
            .catch(err => {
                this.setState({ success: false, message: 
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                });
            })
    }

    exerciseList() {
        return this.state.exercises.map(currentExercise => {
            return <Exercise exercise={currentExercise} key={currentExercise.id}
                onDelete={this.deleteExercise}
                isOwnerOrMod={RoleService.isOwnerOrMod(currentExercise.user)} />
        });
    }

    render() {
        return (
            <div>
                <h3>Logged exercises</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.exerciseList() }
                    </tbody>
                </table>
                <p>You are on the Exercises List component!</p>
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