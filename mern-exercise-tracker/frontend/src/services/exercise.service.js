import http from './http-common';
import authHeader from './auth-header';
import UserService from './user.service';

class ExerciseService {
    subdom = "exercises/";
    getAllExercises() {
        return http.get(this.subdom);
    }

    createExercise(username, description, duration, date, user) {
        return http.post(`${this.subdom}add`, 
            { username, description, duration, date, user},
            { headers: authHeader() 
        });
    }

    getOne(id) {
        return http.get(`${this.subdom}${id}`);
    }

    updateExercise(id, description, duration, date) {
        return http.put(`${this.subdom}update/${id}`, { description, duration, date },
            { headers: authHeader() });
    }

    deleteExercise(id) {
        return http.delete(`${this.subdom}${id}`, { headers: authHeader()});
    }
}

export default new ExerciseService();