import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&display=swap');

    body {
        box-sizing: border-box;
        font-family: 'Public Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
    }
`;

const Theme = ({ children }) => (
    <ThemeProvider theme={{
    }}>
        <GlobalStyles />
        { children }
    </ThemeProvider>
);

export default Theme;
