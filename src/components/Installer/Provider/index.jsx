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
    const [ connectTimer, setConnectTimer ] = useState(null);

    const selectItem = (item) => {
        setSelectedItem(item);
        if (connectTimer) {
            clearInterval(connectTimer);
            setConnectTimer(null);
        }
    }

    return (
        <Context.Provider value={{
            step,
            setStep,
            STEPS,
            workflow,
            setWorkflow,
            selectedItem,
            setSelectedItem: selectItem,
            inputData,
            setInputData,
            connectWindow,
            setConnectWindow,
            connectTimer,
            setConnectTimer,
        }}>
            { children }
        </Context.Provider>
    );
};
