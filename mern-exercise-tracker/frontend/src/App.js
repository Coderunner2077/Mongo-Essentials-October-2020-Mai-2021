import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import Home from "./components/home.component";
import Navbar from "./components/navbar.component";
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import Signup from "./components/signup.component";
import Login from "./components/login.component";
import Profile from "./components/profile.component";
import UsersList from "./components/users-list.component";
import UpdateProfile from "./components/update-profile.component";
import ViewExercise from "./components/view-exercise.component";
import ViewUser from "./components/view-user.component";
import ModeratorBoard from "./components/moderator-board.component";
import AdminBoard from "./components/admin-board.component";

class App extends Component {
  render() {
  return (
    <div className="container">
      <Navbar />
      <br />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/exercises" exact component={ExercisesList} />
        <Route path="/edit/:id" component={EditExercise} />
        <Route path="/create" component={CreateExercise} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/users" exact component={UsersList} />
        <Route path="/user/update/:id" component={UpdateProfile} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/view/:id" component={ViewExercise} />
        <Route path="/user/view/:id" exact component={ViewUser} />
        <Route path="/mod" component={ModeratorBoard} />
        <Route path="/admin" component={AdminBoard} />
      </Switch>
    </div>
  );
  }
}

export default App;
