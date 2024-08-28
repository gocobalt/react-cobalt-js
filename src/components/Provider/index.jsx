import React, { createContext } from "react";
import { Cobalt } from "@cobaltio/cobalt-js";
import ThemeProvider from "../ui/utils/ThemeProvider";

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

/**
 * @param {Object} props
 * @param {import("react").ReactNode} children
 * @param {String} [props.baseApi] Base URL for Cobalt
 * @param {String} props.sessionToken Session Token
 */
export const Provider = ({ children, baseApi, sessionToken }) => {
    const cobalt = new Cobalt({ baseUrl: baseApi || "https://api.gocobalt.io" });

    return (
        <Context.Provider value={{
            cobalt,
            sessionToken,
            theme: "light",
        }}>
            <ThemeProvider>
                { children }
            </ThemeProvider>
        </Context.Provider>
    );
};
