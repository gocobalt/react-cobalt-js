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
