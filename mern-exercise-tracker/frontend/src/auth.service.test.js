import "@testing-library/jest-dom";
import AuthService from "./services/auth.service";
import { server } from "./mocks/server";
import { rest } from "msw";

afterAll(() => AuthService.logOut());

xdescribe("Authentication Service", () => {
    it("signs in a test user", async () => {
        const user = await AuthService.login("test_user", "test_password");
        expect(user).toHaveProperty("username", "test_user");
        expect(user).toHaveProperty("accessToken", "TEST_USER_TOKEN");
    });

    it("returns a user object when user is logged", () => {
        const user = AuthService.getCurrentUser();
        expect(user).toHaveProperty("accessToken");
    });

    it("logs out the user", () => {
        AuthService.logOut();
        const user = AuthService.getCurrentUser();
        expect(user).toBe(null);
    })
});

