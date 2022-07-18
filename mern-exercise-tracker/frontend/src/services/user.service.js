import http from './http-common';
import authHeader from "./auth-header";

class UserService {
    subdom = "test/";

    getPublicContent() {
        return http.get(this.subdom);
    }

    getUser(id) {
        return http.get(`${this.subdom}user/${id}`);
    }
    
    getUsers() {
        return http.get(`${this.subdom}users`, { headers: authHeader()});
    }

    getUserBoard() {
        return http.get(`${this.subdom}user`, { headers: authHeader()} );
    }

    getModeratorBoard() {
        return http.get(`${this.subdom}mod`, { headers: authHeader()});
    }

    getAdminBoard() {
        return http.get(`${this.subdom}admin`, { headers: authHeader()});
    }
}

export default new UserService();