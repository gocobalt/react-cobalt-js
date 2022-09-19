import React, { useContext, useEffect } from "react";

import { Context, STEPS } from "../Provider";

const Content = ({ workflow }) => {
    const { step, steps, setSteps, setWorkflow, selectedItem, setSelectedItem, inputData, setInputData } = useContext(Context);

    useEffect(() => {
        setWorkflow(workflow);
        setSteps(STEPS.filter(s => workflow?.[s.dataField]?.length));
    }, [ workflow ]);

    return (
        <div style={{
            flex: 1,
            display: steps?.length ? "flex" : "none",
            flexDirection: "column",
        }}>
            {
                selectedItem && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        marginBottom: 30,
                        paddingBottom: 30,
                        borderBottom: "1px solid #dfe3e8",
                    }}>
                        <button
                            onClick={ () => setSelectedItem(null) }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 30,
                                height: 30,
                                border: "none",
                                backgroundColor: "rgba(0, 0, 0, .05)",
                                borderRadius: "50%",
                                color: "gray",
                                fontSize: 18,
                                cursor: "pointer",
                            }}
                        >
                            &#10094;
                        </button>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: "bold", color: "#212b36" }}>
                                { workflow?.configure?.find(n => n.node_id === selectedItem)?.node_name || workflow?.applications?.find(a => a.app_type === selectedItem)?.name }
                            </div>
                            <div style={{ fontSize: 16, color: "#919eab" }}>
                                { workflow?.applications?.find(a => a.app_type === selectedItem)?.app_type && `Connect your ${ workflow?.applications?.find(a => a.app_type === selectedItem)?.name } account.` }
                            </div>
                        </div>
                    </div>
                )
            }
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 15,
                overflowY: "auto",
            }}>
                {

                    selectedItem
                    ?   <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 15,
                        }}>
                            {
                                workflow?.applications?.find(a => a.app_type === selectedItem)?.app_type && (
                                    <div>
                                        <div style={{
                                            padding: 15,
                                            backgroundColor: "rgba(33, 43, 54, .1)",
                                            border: "1px solid #212b36",
                                            borderRadius: 8,
                                            color: "#212b36",
                                            fontSize: 14,
                                        }}>
                                            { workflow?.applications?.find(a => a.app_type === selectedItem)?.description }
                                        </div>

                                        {
                                            workflow?.applications?.find(a => a.app_type === selectedItem)?.identifier && (
                                                <input
                                                    readOnly
                                                    disabled
                                                    value={ workflow?.applications?.find(a => a.app_type === selectedItem)?.identifier }
                                                    style={{
                                                        width: "100%",
                                                        marginTop: 20,
                                                        padding: 15,
                                                        border: "none",
                                                        backgroundColor: "#f9fafb",
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.map(field =>
                                    <div key={ field.name }>
                                        <div style={{ marginBottom: 5 }}>
                                            <span>{ field.name }</span>
                                            { !field.required && <span style={{ marginLeft: 5, color: "#919eab", fontSize: 12 }}>(optional)</span> }
                                        </div>
                                        <input
                                            type={ field.app_type }
                                            placeholder={ field.placeholder }
                                            required={ field.required }
                                            style={{
                                                width: "100%",
                                                marginBottom: field.multiple ? 2 : 0,
                                                padding: 15,
                                                border: "none",
                                                backgroundColor: "#f9fafb",
                                                borderRadius: 8,
                                            }}
                                            value={ inputData?.[field.name]?.value }
                                            onChange={ e => setInputData({ [field.name]: { value: field.multiple ? e.target.value?.split(",") : e.target.value }}) }
                                        />
                                        {
                                            field.multiple && (
                                                <div style={{
                                                    color: "#919eab",
                                                    fontSize: 12,
                                                }}>
                                                    Accepts comma separated values.
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    :   step === steps.findIndex(s => s.dataField === "applications")
                        ?   workflow?.applications?.map(item =>
                                <div
                                    key={ item.app_type }
                                    onClick={ () => {
                                        if (item.configured) {
                                            setSelectedItem(item.app_type);
                                        }
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 30,
                                        padding: 15,
                                        border: "1px solid #c4cdd5",
                                        borderRadius: 8,
                                        cursor: item.configured ? "pointer" : "default",
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 15,
                                    }}>
                                        <img
                                            src={ item.icon }
                                            width={ 30 }
                                            height={ 30 }
                                            style={{
                                                borderRadius: 8,
                                            }}
                                        />
                                        <div style={{ fontSize: 18, fontWeight: 600 }}>{ item.name }</div>
                                    </div>
                                    {
                                        item.configured
                                        ?   <img
                                                src={ "https://img.icons8.com/color/48/000000/checked--v1.png" }
                                                width={ 20 }
                                                height={ 20 }
                                                title="Connected"
                                            />
                                        :   <button
                                                style={{
                                                    padding: "5px 10px",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    backgroundColor: "transparent",
                                                    color: "black",
                                                    fontWeight: 600,
                                                    fontSize: 14,
                                                    cursor: "pointer",
                                                }}
                                                onClick={ () => setSelectedItem(item.app_type) }
                                            >
                                                Connect
                                            </button>
                                    }
                                </div>
                            )
                        :   step === steps.findIndex(s => s.dataField === "configure")
                            ?   workflow?.configure?.map(item =>
                                    <div
                                        key={ item.node_id }
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 30,
                                            padding: 15,
                                            border: "1px solid #c4cdd5",
                                            borderRadius: 8,
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 15,
                                        }}>
                                            <img
                                                src={ item.node_icon }
                                                width={ 30 }
                                                height={ 30 }
                                                style={{
                                                    borderRadius: 8,
                                                }}
                                            />
                                            <div style={{ fontSize: 18, fontWeight: 600 }}>{ item.node_name }</div>
                                        </div>
                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                border: "none",
                                                borderRadius: 8,
                                                backgroundColor: "transparent",
                                                color: "black",
                                                fontWeight: 600,
                                                fontSize: 14,
                                                cursor: "pointer",
                                            }}
                                            onClick={ () => setSelectedItem(item?.node_id) }
                                        >
                                            Configure
                                        </button>
                                    </div>
                                )
                            :   null
                }
            </div>
        </div>
    )
};

export default Content;
