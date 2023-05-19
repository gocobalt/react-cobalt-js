import React from "react";
import ReactDOM from "react-dom";

import Error from "./Error";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Error title="Error" message="Error Message" />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("renders without crashing (no props)", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Error />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("renders without crashing (title only)", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Error title="Error" />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("renders without crashing (message only)", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Error message="Error Message" />, div);
    ReactDOM.unmountComponentAtNode(div);
});
