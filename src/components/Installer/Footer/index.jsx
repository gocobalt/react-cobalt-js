import React, { useContext } from "react";

import { Context as SessionContext } from "../../Provider";
import { Context as InstallerContext } from "../Provider";

const Footer = ({ disabled }) => {
    const { cobalt } = useContext(SessionContext);
    const { setStep, STEPS, workflow, selectedItem, setSelectedItem, inputData } = useContext(InstallerContext);

    const connectApp = () => {
        cobalt.getAppAuthStatus(selectedItem)
        .then(connected => {
            if (connected === true) {
                // TODO: set connected status
                console.log(selectedItem, "ALREADY CONNECTED", connected);
                // this.state.connectWindow?.close();
                // this.setState({ connectWindow: null });
                setSelectedItem(null);
            } else {
                cobalt.getAppAuthUrl(selectedItem)
                .then(authUrl => {
                    const connectWindow = window.open(authUrl);
                    // this.setState({ connectWindow });
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
            <div style={{ marginTop: 10, textAlign: "center", fontSize: 12, opacity: .5 }}>Powered by <a href="https://gocobalt.io" target="_blank">Cobalt</a></div>
        </div>
    )
};

export default Footer;
