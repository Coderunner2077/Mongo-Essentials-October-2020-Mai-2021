import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import CheckboxContainer from './components/checkbox-container.component';

afterAll(cleanup);

describe("<App />", () => {
  /*
  it('renders without crashing', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    //screen.debug();
    expect(screen.getByText(/exercise tracker/i)).toBeInTheDocument();
  });

  */

  xit("renders CheckboxContainer correctly", () => {
    const onChangeRoles = jest.fn();
    const roles = [["user", true], ["moderator", false]];
    render(<CheckboxContainer roles={roles} onChange={onChangeRoles} />);
    //screen.debug();
    expect(screen.getByText(/user role/i)).toBeInTheDocument();
  });

  
  /*
  it("renders <Home /> without crashing", () => {
    const { getByText } = render(<Home />);
    expect(getByText(/exercise tracker/i)).toBeInTheDocument();
  });*/


});
