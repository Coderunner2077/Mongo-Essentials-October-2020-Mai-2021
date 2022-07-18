import React from 'react';
import "@testing-library/jest-dom";
import { render, cleanup, screen } from '@testing-library/react';
import Home from "./components/home.component.js";
import { server } from "./mocks/server.js";
import { rest } from "msw";

afterAll(cleanup);

xit("fetches and displays data fetched from server", async () => {
    const { getByText, findByText } = render(<Home />);
    expect(getByText(/loading/i)).toHaveTextContent("Loading page...");
    
    const resolvedEl= await findByText(/welcome/i);
    expect(resolvedEl).toHaveTextContent("Welcome to Exercise Tracker Application!");
});

xit("fails to fetch data and displays a network error", async () => {
    server.use(
        rest.get("http://localhost:5000/api/home", (req, res, ctx) => {
            return res(
                ctx.status(500),
                ctx.json({ message: "Network Error" })
            );
        })
    );

    const { findByText } = render(<Home />);
    const element = await findByText(/network error/i);
    expect(element).toBeInTheDocument();
})