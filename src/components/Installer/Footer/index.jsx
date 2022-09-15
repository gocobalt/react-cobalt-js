import React, { useContext } from "react";

import { Context as SessionContext } from "../../Provider";
import { Context as InstallerContext } from "../Provider";

const Footer = ({ disabled }) => {
    const { cobalt } = useContext(SessionContext);
    const { step, setStep, STEPS, workflow, setWorkflow, selectedItem, setSelectedItem, inputData, connectWindow, setConnectWindow, connectTimer, setConnectTimer } = useContext(InstallerContext);

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
                    const interval = setInterval(() => {
                        cobalt.getAppAuthStatus(selectedItem)
                        .then(connected => {
                            if (connected === true) {
                                setConnected(selectedItem);
                                clearInterval(interval);
                            }
                        })
                        .catch(e => {
                            console.error(e);
                            clearInterval(interval);
                        });
                    }, 3e3);

                    setConnectTimer(interval);
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

    const activateWorkflow = () => {
        // TODO: use activate workflow api when available
        console.log("ACTIVATE");
    };

    return (
        <div style={{
            marginTop: 30,
            paddingTop: 30,
            borderTop: "1px solid #dfe3e8",
        }}>
            <button
                disabled={ !selectedItem && disabled }
                onClick={ selectedItem ? workflow?.configure?.some(n => n.node_id === selectedItem) ? saveNode : connectApp :  step + 1 < STEPS.length ? () => setStep(step + 1) : activateWorkflow }
                style={{
                    width: "100%",
                    padding: 15,
                    border: "none",
                    borderRadius: 8,
                    backgroundColor: !selectedItem && disabled ? "#c4cdd5" : "#212b36",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                    boxShadow: "0 8px 16px 0 rgba(154, 154, 154, 0.24)",
                    cursor: !selectedItem && disabled ? "not-allowed" : "pointer",
                }}
            >
                {
                    selectedItem
                    ?   workflow?.configure?.some(n => n.node_id === selectedItem)
                        ?   "Save"
                        :   workflow?.applications?.find(a => a.app_type === selectedItem)?.configured
                            ?   "Authorized"
                            :   "Authorize"
                    :   step + 1 < STEPS.length
                        ?   "Proceed"
                        :   "Activate"
                }
            </button>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 30,
                textAlign: "center",
                fontSize: 16,
            }}>
                <img
                    src="https://app.gocobalt.io/favicon.png"
                    width={ 16 }
                    height={ 16 }
                />
                <a href="https://gocobalt.io" target="_blank" style={{ textDecoration: "none", color: "#919eab" }}>
                    Powered by Cobalt
                </a>
            </div>
        </div>
    )
};

export default Footer;
