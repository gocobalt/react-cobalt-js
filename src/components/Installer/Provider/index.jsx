import React, { createContext, useState } from "react";

export const STEPS = [
    {
        name: "Authenticate",
        dataField: "applications",
    },
    {
        name: "Configure",
        dataField: "configure",
    },
];

export const Context = createContext();

export const Provider = ({ children }) => {
    const [ step, setStep ] = useState(0);
    const [ steps, setSteps ] = useState(STEPS || []);
    const [ workflow, setWorkflow ] = useState(null);
    const [ selectedItem, setSelectedItem ] = useState(null);
    const [ connectWindow, setConnectWindow ] = useState(null);
    const [ connectTimer, setConnectTimer ] = useState(null);
    const [ dynamicOptions, setDynamicOptions ] = useState(new Map());

    const selectItem = (item) => {
        setSelectedItem(item);
        if (connectTimer) {
            clearInterval(connectTimer);
            setConnectTimer(null);
        }
    }

    const setInputData = (data) => {
        const nodeIndex = workflow?.configure?.findIndex(n => n.node_id === selectedItem);

        if (nodeIndex > -1) {
            const newNode = Object.assign({}, workflow?.configure?.find(n => n.node_id === selectedItem));

            newNode.input_data = {
                ...newNode.input_data,
                ...data,
            };

            const newWorkflow = Object.assign({}, workflow);
            newWorkflow?.configure?.splice(nodeIndex, 1, newNode);

            setWorkflow(newWorkflow);
        }
    };

    const setAuthData = (data) => {
        const appIndex = workflow?.applications?.findIndex(n => n.app_type === selectedItem);

        if (appIndex > -1) {
            const newApp = Object.assign({}, workflow?.applications?.find(n => n.app_type === selectedItem));

            newApp.input_data = {
                ...newApp.input_data,
                ...data,
            };

            const newWorkflow = Object.assign({}, workflow);
            newWorkflow?.applications?.splice(appIndex, 1, newApp);

            setWorkflow(newWorkflow);
        }
    };

    return (
        <Context.Provider value={{
            step,
            setStep,
            steps,
            setSteps,
            STEPS,
            workflow,
            setWorkflow,
            selectedItem,
            setSelectedItem: selectItem,
            inputData: workflow?.configure?.find(n => n.node_id === selectedItem)?.input_data,
            setInputData,
            authData: workflow?.applications?.find(n => n.app_type === selectedItem)?.input_data,
            setAuthData,
            connectWindow,
            setConnectWindow,
            connectTimer,
            setConnectTimer,
            dynamicOptions,
            setDynamicOptions,
        }}>
            { children }
        </Context.Provider>
    );
};
