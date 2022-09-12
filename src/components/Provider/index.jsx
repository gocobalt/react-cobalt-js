import React, { createContext, useState } from "react";

export const Context = createContext();

export const Provider = ({ children, sessionToken }) => {
    const [ token, ] = useState(sessionToken || "");

    return (
        <Context.Provider value={[ token ]}>
            { children }
        </Context.Provider>
    );
};
