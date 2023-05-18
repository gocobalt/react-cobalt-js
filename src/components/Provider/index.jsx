import React, { createContext } from "react";
import Cobalt from "@cobaltio/cobalt-js";
import { CssVarsProvider } from "@mui/joy";

/**
 * @typedef Context
 * @property {Cobalt} cobalt
 * @property {String} sessionToken
 * @property {"dark"|"light"} theme
 */

/**
 * @type React.Context<Context>
 */
export const Context = createContext();

export const Provider = ({ children, baseApi, sessionToken, theme }) => {
    const cobalt = new Cobalt({ baseUrl: baseApi || "https://api.gocobalt.io" });

    return (
        <CssVarsProvider defaultColorScheme={ theme === "dark" ? "dark" : "light" }>
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
