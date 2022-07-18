import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import AuthService from "./services/auth.service";
import UpdateProfile from "./components/update-profile.component";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

afterAll(() => { AuthService.logOut(); cleanup(); });

describe("<UpdateProfile />", () => {
    it("updates user roles logged as admin", async () => {
        await AuthService.login("test_admin", "admin_password");

        const { findByText, getByText, getByLabelText } = render(
            <BrowserRouter>
                <UpdateProfile match={{ params: { id: "test_user_id" }}} />
            </BrowserRouter>
        )
    
        const moderatorEl = await screen.findByLabelText(/moderator/i);
        expect(moderatorEl).toBeInTheDocument();
        const adminPassword = await screen.findByLabelText(/admin password/i);
        expect(adminPassword).toBeInTheDocument();
        userEvent.click(moderatorEl);
        fireEvent.change(screen.getByLabelText(/admin password/i), { target: { value: "admin_password" }});
        userEvent.click(screen.getByRole("button"));

        const updatedEl = await findByText(/user updated/i);
        expect(updatedEl).toBeInTheDocument();   
    });

    it("updates admin user roles logged as himself (admin)", async () => {
        await AuthService.login("test_admin", "admin_password");

        const { findByText } = render(
            <BrowserRouter>
                <UpdateProfile match={{ params: { id: "test_admin_id" }}} />
            </BrowserRouter>
        );
        
        const adminRole = await screen.findByLabelText(/admin authority/i);
        expect(adminRole).toBeInTheDocument();

        const currentPassword = await screen.findByLabelText(/current password/i);
        expect(currentPassword).toBeInTheDocument();
        userEvent.click(adminRole);
        fireEvent.change(currentPassword, { target: { value: "admin_password" }});
        userEvent.click(screen.getByRole("button"));

        const updatedEl = await findByText(/user updated/i);
        expect(updatedEl).toBeInTheDocument();
    });

    
    it("fails to update user roles due to lack of admin privileges", async () => {
        await AuthService.login("test_user", "user_password");

        const { findByText, getByLabelText } = render(
            <BrowserRouter>
                <UpdateProfile match={{ params: { id: "test_user_id" }}} />
            </BrowserRouter>
        )

        await screen.findByLabelText(/admin password/i);

        const password = await screen.findByLabelText(/(?:admin|current) password/i);
        expect(screen.queryByLabelText(/admin authority/i)).not.toBeInTheDocument();
        fireEvent.change(password, { target: { value: "user_password" }});
        fireEvent.change(getByLabelText("Username"), { target: { value: "test_user_edited"}});
        userEvent.click(screen.getByRole("button"));       

        const updatedEl = await findByText(/user updated/i);
        expect(updatedEl).toBeInTheDocument();
    });
})