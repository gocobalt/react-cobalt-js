import React, { createContext, useState } from "react";

const STEPS = {
    CONNECT: "Connect",
    CONFIGURE: "Configure",
};

export const Context = createContext();

export const Provider = ({ children }) => {
    const [ step, setStep ] = useState(STEPS.CONNECT);
    const [ workflow, setWorkflow ] = useState(null);
    const [ selectedItem, setSelectedItem ] = useState(null);
    const [ inputData, setInputData ] = useState({});
    const [ connectWindow, setConnectWindow ] = useState(null);

    return (
        <Context.Provider value={{
            step,
            setStep,
            STEPS,
            workflow,
            setWorkflow,
            selectedItem,
            setSelectedItem,
            inputData,
            setInputData,
            connectWindow,
            setConnectWindow,
        }}>
            { children }
        </Context.Provider>
    );
};
