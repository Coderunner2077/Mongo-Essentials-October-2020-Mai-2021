import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthService from "./services/auth.service.js";
import CreateExercise from "./components/create-exercise.component";
import { BrowserRouter } from 'react-router-dom';
import { server } from "./mocks/server";
import { rest } from 'msw';
import { baseUrl } from './mocks/handlers';

beforeAll(async () => await AuthService.login("test_user", "test_password"));
afterAll(() => { AuthService.logOut(); cleanup(); })

it("creates a new exercise", async () => {
    const { getByText, findByText, getByLabelText, getByRole } = render(<BrowserRouter><CreateExercise /></BrowserRouter>);
    expect(getByText(/create new exercise/i)).toBeInTheDocument();
    //userEvent.type(getByTestId("description"), "Ceci est un nouvel exercise");
    fireEvent.change(getByLabelText(/description/i), { target: { value: "Ceci est un nouvel exercise" }});
    expect(getByText(/un nouvel exercise/)).toHaveValue("Ceci est un nouvel exercise");

    fireEvent.change(getByLabelText("Duration"), { target: { value: 45 }});
    fireEvent.click(getByRole("button"));
    const element = await findByText(/new exercise added/i);
    expect(element).toBeInTheDocument();
});


it("fails to create a new exercise", async () => {
    server.use(
        rest.post(`${baseUrl}/exercises/add`, (req, res, ctx) => {
            return res(
                ctx.status(500),
                ctx.json({ message: "Ops! Something went wrong..." })
            );
        })
    )
    const { getByText, findByText, getByLabelText, getByRole } = render(<BrowserRouter><CreateExercise /></BrowserRouter>);
    expect(getByText(/create new exercise/i)).toBeInTheDocument();

    fireEvent.change(getByLabelText("Description"), { target: { value: "Description test" }});
    fireEvent.change(getByLabelText("Duration"), { target: { value: 50 }});
    fireEvent.click(getByRole("button"));

    const resolvedEl = await findByText(/ops!/i);
    expect(resolvedEl).toBeInTheDocument();
    expect(resolvedEl).toHaveTextContent("Ops! Something went wrong...");
});

