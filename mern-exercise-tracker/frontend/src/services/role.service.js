class RoleService {
    getCurrentUser() {
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user)
            return null;
        if(Date.now() > (user.signedAt + user.expiresIn * 1000))
            this.logOut();
        else
            return user;
    }

    isAuthenticated() {
        return !this.getCurrentUser() ? false : true;
    }

    isModerator() {
        let user = this.getCurrentUser();
        if(!user)
            return false;

        return user.roles.includes("ROLE_MODERATOR");
    }

    isAdmin() {
        let user = this.getCurrentUser();
        if(!user) return false;

        return user.roles.includes("ROLE_ADMIN");
    }

    isOwner(id) {
        let user = this.getCurrentUser();
        if(!user) return false;

        return user.id === id;
    }

    isOwnerOrMod(id) {
        return this.isOwner(id) || this.isModerator();
    }

    logOut() {
        localStorage.removeItem("user");
    }

    isOwnerOrAdmin(id) {
        return this.isOwner(id) || this.isAdmin();
    }
}

export default new RoleService();