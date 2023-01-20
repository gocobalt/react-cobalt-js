import React, { createContext } from "react";
import Cobalt from "@cobaltio/cobalt-js";
import { CssVarsProvider } from "@mui/joy";

export const Context = createContext();

export const Provider = ({ children, baseApi, sessionToken, theme }) => {
    const cobalt = new Cobalt({ baseUrl: baseApi || "https://api.gocobalt.io" });

    return (
        <CssVarsProvider>
            <Context.Provider value={{
                cobalt,
                sessionToken,
                theme: theme === "dark" ? "dark" : "light",
            }}>
                { children }
            </Context.Provider>
        </CssVarsProvider>
    );
};
