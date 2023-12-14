import React, { createContext } from "react";
import { Cobalt } from "@cobaltio/cobalt-js";
import { CssVarsProvider, extendTheme } from "@mui/joy";

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
    const customTheme = extendTheme({
        components: {
            JoyInput: {
                defaultProps: {
                    size: "lg",
                },
                styleOverrides: {
                    root: {
                        borderColor: "rgba(145, 158, 171, 0.24)",
                    },
                },
            },
            JoySelect: {
                defaultProps: {
                    size: "lg",
                },
                styleOverrides: {
                    listbox: {
                        boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)`,
                        borderColor: "rgba(145, 158, 171, 0.24)",
                    },
                    root: {
                        borderColor: "rgba(145, 158, 171, 0.24)",
                    },
                },
            },
            JoyTextarea: {
                defaultProps: {
                    size: "lg",
                },
                styleOverrides: {
                    root: {
                        borderColor: "rgba(145, 158, 171, 0.24)",
                    },
                },
            },
            JoySheet: {
                styleOverrides: {
                    root: {
                        borderColor: "rgba(145, 158, 171, 0.12)"
                    },
                },
            },
            JoyTab: {
                styleOverrides: {
                    root: {
                        fontWeight: 600,
                    },
                },
            },
            JoyDivider: {
                styleOverrides: {
                    root: {
                        backgroundColor: "rgba(145, 158, 171, 0.24)"
                    },
                },
            },
        },
    });

    return (
        <CssVarsProvider defaultColorScheme="light" theme={ customTheme }>
            <Context.Provider value={{
                cobalt,
                sessionToken,
                theme: "light",
            }}>
                { children }
            </Context.Provider>
        </CssVarsProvider>
    );
};
