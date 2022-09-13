import React, { useContext, useEffect } from "react";

import { Context } from "../Provider";

const Content = ({ workflow }) => {
    const { step, STEPS, setWorkflow, selectedItem, setSelectedItem, inputData, setInputData } = useContext(Context);

    useEffect(() => {
        setWorkflow(workflow);
        if (workflow?.applications?.length === 1) {
            setSelectedItem(workflow?.applications[0]);
        }
    }, [ workflow ]);

    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
        }}>
            <div>
                {
                    selectedItem && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                            padding: 10,
                            borderBottom: "1px solid lightgray",
                        }}>
                            <button
                                onClick={ () => setSelectedItem(null) }
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 25,
                                    height: 25,
                                    border: "none",
                                    borderRadius: "50%",
                                    color: "gray",
                                    fontSize: 16,
                                    cursor: "pointer",
                                }}
                            >
                                &#10094;
                            </button>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: "bold" }}>{ workflow?.configure?.find(n => n.node_id === selectedItem)?.node_name || selectedItem }</div>
                                <div style={{ fontSize: 14, color: "gray" }}>{ workflow?.configure?.find(n => n.node_id === selectedItem)?.node_description }</div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 15,
                padding: 15,
                overflowY: "auto",
            }}>
                {
                    selectedItem
                    ?   <div>
                            {
                                workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.map(field =>
                                    <div key={ field.name }>
                                        <div style={{ marginBottom: 5 }}>{ field.name }</div>
                                        <input
                                            type={ field.type }
                                            placeholder={ field.placeholder }
                                            required={ field.required }
                                            style={{
                                                width: "100%",
                                                marginBottom: 15,
                                                padding: "10px",
                                                border: "1px solid #dfe3e8",
                                                borderRadius: 8,
                                                marginBottom: field.multiple ? 2 : 15,
                                            }}
                                            value={ inputData[field.name]?.value }
                                            onChange={ e => setInputData({ ...inputData, [field.name]: { value: field.multiple ? e.target.value?.split(",") : e.target.value }}) }
                                        />
                                        {
                                            field.multiple && (
                                                <div style={{
                                                    marginBottom: 15,
                                                    fontSize: 12,
                                                    opacity: .4,
                                                }}>
                                                    Accepts comma separated values.
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    :   step === STEPS.CONNECT
                        ?   workflow?.applications?.map(item =>
                                <div
                                    key={ item }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 30,
                                        padding: 10,
                                        border: "1px solid lightgray",
                                        borderRadius: 8,
                                        boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.12)",
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}>
                                        <img
                                            src={ item }
                                            width={ 35 }
                                            height={ 35 }
                                            style={{
                                                borderRadius: 8,
                                            }}
                                        />
                                        <div>{ item }</div>
                                    </div>
                                    <button
                                        style={{
                                            padding: "5px 10px",
                                            border: "none",
                                            borderRadius: 8,
                                            color: "black",
                                            fontWeight: 600,
                                            fontSize: 14,
                                            cursor: "pointer",
                                        }}
                                        onClick={ () => {
                                            setInputData({});
                                            setSelectedItem(item);
                                        }}
                                    >
                                        Connect
                                    </button>
                                </div>
                            )
                        :   step === STEPS.CONFIGURE
                            ?   workflow?.configure?.map(item =>
                                    <div
                                        key={ item.node_id }
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 30,
                                            padding: 10,
                                            border: "1px solid lightgray",
                                            borderRadius: 8,
                                            boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.12)",
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}>
                                            <img
                                                src={ item.node_icon }
                                                width={ 35 }
                                                height={ 35 }
                                                style={{
                                                    borderRadius: 8,
                                                }}
                                            />
                                            <div>{ item.node_name }</div>
                                        </div>
                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                border: "none",
                                                borderRadius: 8,
                                                color: "black",
                                                fontWeight: 600,
                                                fontSize: 14,
                                                cursor: "pointer",
                                            }}
                                            onClick={ () => {
                                                setInputData({});
                                                setSelectedItem(item?.node_id);
                                            }}
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
