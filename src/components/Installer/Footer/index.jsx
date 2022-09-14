import React, { useContext } from "react";

import { Context as SessionContext } from "../../Provider";
import { Context as InstallerContext } from "../Provider";

const Footer = ({ disabled }) => {
    const { cobalt } = useContext(SessionContext);
    const { setStep, STEPS, workflow, setWorkflow, selectedItem, setSelectedItem, inputData, connectWindow, setConnectWindow } = useContext(InstallerContext);

    const setConnected = (appType) => {
        const appIndex = workflow?.applications?.findIndex(a => a.app_type === appType);
        if (appIndex > -1) {
            const newApp = { ...workflow.applications[appIndex] };
            newApp.configured = true;

            const newApps = [ ...workflow.applications ];
            newApps.splice(appIndex, 1, newApp);

            setWorkflow({ ...workflow, applications: newApps });
        }
    };

    const connectApp = () => {
        cobalt.getAppAuthStatus(selectedItem)
        .then(connected => {
            if (connected === true) {
                setConnected(selectedItem);

                connectWindow?.close();
                setConnectWindow(null);

                setSelectedItem(null);
            } else {
                cobalt.getAppAuthUrl(selectedItem)
                .then(authUrl => {
                    const connectWindow = window.open(authUrl);
                    setConnectWindow(connectWindow);

                    // keep checking connection status
                    setInterval(() => {
                        cobalt.getAppAuthStatus(selectedItem)
                        .then(connected => {
                            if (connected === true) {
                                setConnected(selectedItem);
                            }
                        })
                        .catch(console.error);
                    }, 3e3);
                })
                .catch(console.error);
            }
        })
        .catch(console.error);
    };

    const saveNode = () => {
        // TODO: handle error
        cobalt.saveNode(workflow?.workflow_id, selectedItem, inputData)
        .then(() => {
            setSelectedItem(null);
        })
        .catch(console.error);
    };

    return (
        <div style={{
            padding: 10,
            borderTop: "1px solid lightgray",
        }}>
            <button
                disabled={ !selectedItem && disabled }
                onClick={ selectedItem ? workflow?.configure?.some(n => n.node_id === selectedItem) ? saveNode : connectApp : () => setStep(STEPS.CONFIGURE) }
                style={{
                    width: "100%",
                    padding: 15,
                    border: "none",
                    borderRadius: 8,
                    color: !selectedItem && disabled ? "lightgray" : "black",
                    fontWeight: "bold",
                    fontSize: 16,
                    cursor: !selectedItem && disabled ? "not-allowed" : "pointer",
                }}
            >
                { selectedItem ? workflow?.configure?.some(n => n.node_id === selectedItem) ? "Save" : "Authorize" : "Proceed" }
            </button>
            <div style={{ marginTop: 5, textAlign: "center", fontSize: 12, opacity: .5 }}>Powered by <a href="https://gocobalt.io" target="_blank">Cobalt</a></div>
        </div>
    )
};

export default Footer;
