import React from "react";
import PropTypes from "prop-types";
import Cobalt from "cobalt.js";

const cobalt = new Cobalt({ baseUrl: "https://embedapi.gocobalt.io" });

class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workflow: {},
            selectedNode: "",
            inputData: {},
        };
    }

    saveNode = () => {
        cobalt.saveNode(this.state.selectedNode, this.state.inputData)
        .then(console.log)
        .catch(console.error);
    };

    componentDidMount() {
        cobalt.token = this.props.templateToken;
        cobalt.installTemplate()
        .then(data => this.setState({ workflow: data }))
        .catch(console.error);
    }

    componentWillUnmount() {
        cobalt.token = "";

        this.setState({
            selectedNode: "",
        });
    }

    render() {
        return (
            <div style={ styles.background } onClick={ this.props.onClose }>
                <div style={ styles.container } onClick={ e => e.stopPropagation() }>
                    <div style={{
                        ...styles.section,
                        backgroundColor: "rgba(0, 0, 0, .05)",
                    }}>
                        <div style={ styles.sidebarHeader }>
                            <h3>{ this.state.workflow?.workflow_name }</h3>
                            <p>{ this.state.workflow?.workflow_description }</p>
                        </div>
                        <div style={ styles.sidebarContent }>
                            {
                                this.state.workflow?.configure?.map(node =>
                                    <div
                                        style={{
                                            ...styles.sidebarItem,
                                            ...(this.state.selectedNode === node.node_id ? styles.sidebarItemSelected : {}),
                                        }}
                                        onClick={ () => this.setState({ selectedNode: node.node_id }) }
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
                            this.state.selectedNode && (
                                <div style={ styles.contentHeader }>
                                    <img
                                        src={ this.state.workflow?.configure?.find(n => n.node_id === this.state.selectedNode)?.node_icon }
                                        width={ 32 }
                                        height={ 32 }
                                        style={ styles.sidebarItemIcon }
                                    />
                                    <h3>{ this.state.workflow?.configure?.find(n => n.node_id === this.state.selectedNode)?.node_name }</h3>
                                </div>
                            )
                        }
                        <div>
                            {
                                this.state.workflow?.configure?.find(n => n.node_id === this.state.selectedNode)?.fields?.map(field =>
                                    <div>
                                        <div style={ styles.inputLabel }>{ field.name }</div>
                                        <input
                                            type={ field.type }
                                            placeholder={ field.placeholder }
                                            required={ field.required }
                                            style={ styles.inputText }
                                            value={ this.state.inputData[field.name] }
                                            onChange={ e => this.setState({ inputData: { ...this.state.inputData, [field.name]: e.target.value }}) }
                                        />
                                    </div>
                                )
                            }
                        </div>
                        {
                            this.state.selectedNode && (
                                <div style={ styles.footer }>
                                    <button style={ styles.button } onClick={ this.saveNode }>
                                        Next
                                    </button>
                                </div>
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
    templateToken: PropTypes.string,
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
    },
    container: {
        display: "flex",
        flexDirection: "row",
        // minWidth: 300,
        borderRadius: 15,
        backgroundColor: "white",
        color: "black",
        boxShadow: "8px 24px 24px 12px rgba(0, 0, 0, .1)",
    },
    section: {
        flex: 1,
        padding: 40,
    },
    sidebarHeader: {
        marginBottom: 20,
    },
    sidebarContent: {
        display: "flex",
        flexDirection: "column",
    },
    sidebarItem: {
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
        padding: 5,
        cursor: "pointer",
        border: "1px solid rgba(0, 0, 0, .05)",
        borderRadius: 8,
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
        marginBottom: 20,
    },
    inputLabel: {
        marginBottom: 5,
    },
    inputText: {
        width: "100%",
        marginBottom: 15,
        padding: "10px 15px",
        border: "1px solid rgba(0, 0, 0, .1)",
        borderRadius: 8,
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 20,
    },
    button: {
        padding: "10px 15px",
        backgroundColor: "rgba(0, 0, 0, .1)",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
    },
};

export default Modal;
