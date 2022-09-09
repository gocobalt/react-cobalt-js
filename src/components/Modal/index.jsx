import React from "react";
import PropTypes from "prop-types";
import Cobalt from "@cobaltio/cobalt-js";

const cobalt = new Cobalt({ baseUrl: "https://embedapi.gocobalt.io" });

class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workflow: {},
            selectedApp: "",
            selectedNode: "",
            inputData: {},
            connectWindow: null,
        };
    }

    connectApp = () => {
        cobalt.getAppAuthStatus(this.state.selectedApp)
        .then(connected => {
            if (connected === true) {
                // TODO: set connected status
                console.log(this.state.selectedApp, "ALREADY CONNECTED", connected);
                this.state.connectWindow?.close();
                this.setState({ connectWindow: null });
            } else {
                cobalt.getAppAuthUrl(this.state.selectedApp)
                .then(authUrl => {
                    const connectWindow = window.open(authUrl);
                    this.setState({ connectWindow });
                })
                .catch(console.error);
            }
        })
        .catch(console.error);
    };

    saveNode = () => {
        cobalt.saveNode(this.state.workflow?.workflow_id, this.state.selectedNode, this.state.inputData)
        .then(console.log)
        .catch(console.error);
    };

    componentDidMount() {
        cobalt.token = this.props.sessionToken;
        cobalt.installTemplate(this.props.templateId)
        .then(data => this.setState({ workflow: data }))
        .catch(console.error);
    }

    componentWillUnmount() {
        cobalt.token = "";

        this.setState({
            selectedApp: "",
            selectedNode: "",
        });
    }

    render() {
        return (
            <div style={ styles.background } onClick={ this.props.onClose }>
                <div style={ styles.container } onClick={ e => e.stopPropagation() }>
                    <div style={{
                        ...styles.section,
                        padding: 24,
                        borderRight: "1px solid #dfe3e8",
                    }}>
                        <div style={ styles.sidebarHeader }>
                            <div style={ styles.sidebarHeaderTitle }>{ this.state.workflow?.workflow_name || "Workflow" }</div>
                            <div style={{ color: "#919eab" }}>{ this.state.workflow?.workflow_description || "Connect accounts and configure the workflow." }</div>
                        </div>
                        <div style={ styles.sidebarContent }>
                            {
                                this.state.workflow?.applications?.map(app =>
                                    <div
                                        key={ app }
                                        style={{
                                            ...styles.sidebarItem,
                                            ...(this.state.selectedApp === app ? styles.sidebarItemSelected : {}),
                                        }}
                                        onClick={ () => this.setState({ selectedApp: app, selectedNode: "" }) }
                                    >
                                        <img
                                            src={ "https://img.icons8.com/color/48/000000/checked--v1.png" }
                                            width={ 20 }
                                            height={ 20 }
                                            style={ styles.sidebarItemIcon }
                                        />
                                        <div style={{ textTransform: "capitalize" }}>Connect { app.replaceAll("_", " ") }</div>
                                    </div>
                                )
                            }
                            {
                                this.state.workflow?.configure?.map(node =>
                                    <div
                                        key={ node.node_id }
                                        style={{
                                            ...styles.sidebarItem,
                                            ...(this.state.selectedNode === node.node_id ? styles.sidebarItemSelected : {}),
                                        }}
                                        onClick={ () => this.setState({ selectedApp: "", selectedNode: node.node_id }) }
                                    >
                                        <img
                                            src={ node.node_icon }
                                            width={ 20 }
                                            height={ 20 }
                                            style={ styles.sidebarItemIcon }
                                        />
                                        <div>{ node.node_name }</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div style={ styles.section }>
                        {
                            this.state.selectedApp && (
                                <React.Fragment>
                                    <div style={ styles.contentHeader }>
                                        <img
                                            src={ "https://img.icons8.com/color/48/000000/checked--v1.png" }
                                            width={ 32 }
                                            height={ 32 }
                                            style={ styles.sidebarItemIcon }
                                        />
                                        <h3 style={{ textTransform: "capitalize" }}>{ this.state.selectedApp.replaceAll("_", " ") }</h3>
                                    </div>
                                    <div key={ this.state.selectedApp } style={ styles.contentBody }>

                                    </div>
                                    <div style={ styles.contentFooter }>
                                        <button style={ styles.button } onClick={ this.connectApp }>
                                            Connect
                                        </button>
                                    </div>
                                </React.Fragment>
                            )
                        }
                        {
                            this.state.selectedNode && (
                                <React.Fragment>
                                    <div style={ styles.contentHeader }>
                                        <img
                                            src={ this.state.workflow?.configure?.find(n => n.node_id === this.state.selectedNode)?.node_icon }
                                            width={ 32 }
                                            height={ 32 }
                                            style={ styles.sidebarItemIcon }
                                        />
                                        <h3>{ this.state.workflow?.configure?.find(n => n.node_id === this.state.selectedNode)?.node_name }</h3>
                                    </div>
                                    <div key={ this.state.selectedNode } style={ styles.contentBody }>
                                        {
                                            this.state.workflow?.configure?.find(n => n.node_id === this.state.selectedNode)?.fields?.map(field =>
                                                <div key={ field.name }>
                                                    <div style={ styles.inputLabel }>{ field.name }</div>
                                                    <input
                                                        type={ field.type }
                                                        placeholder={ field.placeholder }
                                                        required={ field.required }
                                                        style={{
                                                            ...styles.inputText,
                                                            marginBottom: field.multiple ? 2 : 15,
                                                        }}
                                                        value={ this.state.inputData[field.name]?.value }
                                                        onChange={ e => this.setState({ inputData: { ...this.state.inputData, [field.name]: { value: field.multiple ? e.target.value?.split(",") : e.target.value }}}) }
                                                    />
                                                    { field.multiple && <div style={ styles.inputHelp }>Accepts comma separated values.</div> }
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div style={ styles.contentFooter }>
                                        <button style={ styles.button } onClick={ this.saveNode }>
                                            Save
                                        </button>
                                    </div>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
};

Modal.propTypes = {
    templateId: PropTypes.string,
    sessionToken: PropTypes.string,
    onClose: PropTypes.func,
};

const styles = {
    background: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, .5)",
        backdropFilter: "blur(5px)",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2000,
        overflow: "auto",
    },
    container: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        maxWidth: 900,
        maxHeight: 700,
        borderRadius: 15,
        backgroundColor: "white",
        color: "black",
        boxShadow: "8px 24px 24px 12px rgba(0, 0, 0, .1)",
    },
    section: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    sidebarHeader: {
        marginBottom: 40,
    },
    sidebarHeaderTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    sidebarContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
    },
    sidebarItem: {
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
        padding: 5,
        cursor: "pointer",
        border: "1px solid #dfe3e8",
        borderRadius: 5,
    },
    sidebarItemIcon: {
        borderRadius: 8,
        marginRight: 8,
    },
    sidebarItemSelected: {
        backgroundColor: "rgba(0, 0, 0, .02)",
    },
    contentHeader: {
        display: "flex",
        alignItems: "center",
        padding: "24px 24px 16px",
        borderBottom: "1px solid #dfe3e8",
    },
    contentBody: {
        flex: 1,
        padding: "16px 24px",
        overflowY: "auto",
    },
    contentFooter: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px 24px 24px",
        borderTop: "1px solid #dfe3e8",
    },
    inputLabel: {
        marginBottom: 5,
    },
    inputText: {
        width: "100%",
        marginBottom: 15,
        padding: "10px",
        border: "1px solid #dfe3e8",
        borderRadius: 8,
    },
    inputHelp: {
        marginBottom: 15,
        fontSize: 12,
        opacity: .4,
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "transparent",
        border: "2px solid #6129ff",
        borderRadius: 8,
        color: "#6129ff",
        fontWeight: "bold",
        textTransform: "capitalize",
        cursor: "pointer",
    },
};

export default Modal;
