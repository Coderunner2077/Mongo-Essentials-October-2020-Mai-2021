import http from './http-common';
import authHeader from './auth-header';

class AuthService {
    auth = "auth/";

    register(username, email, password, roles = []) {
        return http.post(`${this.auth}signup`, { username, email, password, roles });
    }

    login(username, password) {
        return http.post(`${this.auth}signin`, { username, password})
            .then(res => {
                if(res.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    return res.data;
                }
            });
    }

    updateUser(id, username = "", email = "", password = "", newPassword = "", roles = []) {
        return http.put(`${this.auth}update/${id}`, { username, email, password, newPassword, roles }, { headers: authHeader() })
            .then(res => {
                let user = this.getCurrentUser();
                if(user.id !== id)
                    return Promise.resolve({ data: res.data });
                let data = {};
                Object.assign(data, res.data);
                delete data.message;
                user = {...user, ...data.updates};
                localStorage.setItem("user", JSON.stringify(user));
                return Promise.resolve({ data: res.data });
            });
    }

    deleteUser(id) {
        return http.delete(`${this.auth}delete/${id}`, { headers: authHeader() })
            .then(res => {
                let user = this.getCurrentUser();
                if(user.id === id)
                    this.logOut();
                return Promise.resolve({ data: res.data });
            })
    }

    getCurrentUser() {
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user)
            return null;

        if(Date.now() >= (user.signedAt + user.expiresIn * 1000))
            this.logOut();
        else
            return user;
    }

    logOut() {
        localStorage.removeItem("user");
    }
}

export default new AuthService();