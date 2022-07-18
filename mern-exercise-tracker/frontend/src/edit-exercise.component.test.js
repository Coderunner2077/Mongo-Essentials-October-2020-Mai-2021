import React from 'react';
import "@testing-library/jest-dom";
import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import EditExercise from "./components/edit-exercise.component";
import AuthService from "./services/auth.service";
import { server } from "./mocks/server";
import { baseUrl } from "./mocks/handlers";

(async () => await AuthService.login("test_user", "test_password"));
afterAll(() => { AuthService.logOut(); cleanup(); });

jest.setTimeout(100000);
it("fetches and updates an exercise", async () => {
    const { getByText, findByText } = render(
        <BrowserRouter>
            <EditExercise match={ { params: { id: "exercise_id" }} } />
        </BrowserRouter>
    );
    
    expect(getByText(/edit exercise log/i)).toBeInTheDocument();
    
    const description = await findByText(/test description/i);
    expect(description).toHaveValue("This is a test description");
    
    userEvent.clear(description);
    userEvent.type(description, "This is new test description");
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: 20 }});
    userEvent.click(screen.getByRole("button"));
    const success = await findByText(/exercise updated/i);
    
    expect(success).toHaveTextContent("Exercise updated!");
    screen.debug();
});

it("fetches and fails to update an exercise", async () => {
    server.use(
        rest.put(`${baseUrl}/exercises/update/:id`, (req, res, ctx) => {
            return res(
                ctx.status(400),
                ctx.json({ message: "Ops! Something went wrong..." })
            )
        })
    );
    const { getByText, findByText } = render(
        <BrowserRouter>
            <EditExercise match={{ params: { id: "exercise_id" }}} />
        </BrowserRouter>
    );

    await findByText(/test description/i);
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "This is new test description" }});
    expect(getByText(/test description/i)).toHaveValue("This is new test description");
    userEvent.click(screen.getByRole("button"));
    const failureEl = await findByText(/ops/i);
    expect(failureEl).toHaveTextContent("Ops! Something went wrong...");
});

it("fails to send the submit request due to user input", async () => {
    const { findByText, getByRole, getByText, getAllByText, queryByText } = render(
        <EditExercise match={{ params: { id: "exercise_id" }}} />
    );

    const description = await findByText(/test description/i);
    expect(description).toHaveValue("This is a test description");
    expect(queryByText(/field is required/)).not.toBeInTheDocument();
    userEvent.clear(description);
    userEvent.click(getByRole("button"));
    expect(getByText("This field is required")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: "not a number" }});
    expect(getAllByText(/field is required/)).toHaveLength(2);
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: -21 }});
    expect(getByText(/not a valid number/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: 2100000 }});
    expect(getByText(/not a valid number/)).toBeInTheDocument();
})