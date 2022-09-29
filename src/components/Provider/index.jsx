import React, { createContext } from "react";
import Cobalt from "@cobaltio/cobalt-js";

const cobalt = new Cobalt({ baseUrl: "https://embedapi.gocobalt.io" });

export const Context = createContext();

export const Provider = ({ children, sessionToken, theme }) => {
    return (
        <Context.Provider value={{
            cobalt,
            sessionToken,
            theme: theme === "dark" ? "dark" : "light",
        }}>
            { children }
        </Context.Provider>
    );
};
