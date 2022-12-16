import React, { useContext } from "react";

import { Context as SessionContext } from "../../Provider";
import { Context as InstallerContext } from "../Provider";

const Footer = ({ disabled, onInstall, onClose }) => {
    const { cobalt } = useContext(SessionContext);
    const { step, setStep, steps, workflow, setWorkflow, selectedItem, setSelectedItem, inputData, authData, connectWindow, setConnectWindow, connectTimer, setConnectTimer } = useContext(InstallerContext);

    const setConnected = (appType, status = true) => {
        const appIndex = workflow?.applications?.findIndex(a => a.app_type === appType);
        if (appIndex > -1) {
            const newApp = { ...workflow.applications[appIndex] };
            newApp.configured = status;
            newApp.identifier = status ? "" : undefined;

            const newApps = [ ...workflow.applications ];
            newApps.splice(appIndex, 1, newApp);

            setWorkflow({ ...workflow, applications: newApps });
        }
    };

    const saveAuth = () => {
        cobalt.setAppAuthData(selectedItem, authData, workflow?.applications?.find(a => a.app_type === selectedItem)?.app_id)
        .then(() => {
            setConnected(selectedItem);
            setSelectedItem(null);
        })
        .catch(console.error);
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
                                connectWindow?.close();
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

    const removeApp = () => {
        cobalt.removeAppAuth(selectedItem, workflow?.applications?.find(a => a.app_type === selectedItem)?.app_id)
        .then(() => setConnected(selectedItem, false))
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
        if (onInstall instanceof Function) {
            // TODO: handle error
            cobalt.activateWorkflow(workflow?.workflow_id)
            .then(() => {
                onInstall(workflow?._id);
            })
            .catch(console.error);
        } else if (onClose instanceof Function) {
            // TODO: handle error
            cobalt.toggleWorkflowStatus(workflow?.workflow_id)
            .then(() => {
                onClose(workflow?._id);
            })
            .catch(console.error);
        }
    };

    return (
        <div style={{
            marginTop: steps?.length ? 30 : 0,
            paddingTop: 15,
            borderTop: "1px solid #dfe3e8",
        }}>
            <button
                disabled={ !selectedItem && workflow?.applications?.some(app => !app.configured) }
                onClick={
                    selectedItem
                    ?   workflow?.configure?.some(n => n.node_id === selectedItem)
                        ?   saveNode
                        :   workflow?.applications?.find(a => a.app_type === selectedItem)?.configured
                            ?   removeApp
                            :   workflow?.applications?.find(a => a.app_type === selectedItem)?.auth_type === "oauth"
                                ?   connectApp
                                :   saveAuth
                    :  step + 1 < steps.length
                        ?   () => setStep(step + 1)
                        :   activateWorkflow
                }
                style={{
                    width: "100%",
                    padding: 15,
                    border: "none",
                    borderRadius: 8,
                    backgroundColor: !selectedItem && workflow?.applications?.some(app => !app.configured) ? "#c4cdd5" : "#212b36",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                    boxShadow: "0 8px 16px 0 rgba(154, 154, 154, 0.24)",
                    cursor: !selectedItem && workflow?.applications?.some(app => !app.configured) ? "not-allowed" : "pointer",
                }}
            >
                {
                    selectedItem
                    ?   workflow?.configure?.some(n => n.node_id === selectedItem)
                        ?   "Save"
                        :   workflow?.applications?.find(a => a.app_type === selectedItem)?.configured
                            ?   "Remove Account"
                            :   "Connect Account"
                    :   step + 1 < steps.length
                        ?   "Proceed"
                        :   "Activate"
                }
            </button>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 8,
                textAlign: "center",
                fontSize: 12,
            }}>
                <img
                    src={
                        workflow?.applications?.some(a => a.app_type === selectedItem)
                        ?   "https://img.icons8.com/plumpy/24/000000/info.png"
                        :   "https://app.gocobalt.io/favicon.png"
                    }
                    width={ 16 }
                    height={ 16 }
                />
                <a href="https://gocobalt.io" target="_blank" style={{ textDecoration: "none", color: "#919eab" }}>
                    {
                        workflow?.applications?.some(a => a.app_type === selectedItem)
                        ?   "Your credentials are encrypted & secure."
                        :   "Powered by Cobalt"
                    }
                </a>
            </div>
        </div>
    )
};

export default Footer;
