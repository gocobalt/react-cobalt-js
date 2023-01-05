import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Context as SessionContext } from "../../Provider";
import { Context, STEPS } from "../Provider";

const Content = ({ defaultWorkflow }) => {
    const { cobalt } = useContext(SessionContext);
    const { step, steps, setSteps, workflow, setWorkflow, selectedItem, setSelectedItem, inputData, setInputData, authData, setAuthData, dynamicOptions, setDynamicOptions } = useContext(Context);

    const [ showOptionalFields, setShowOptionalFields ] = useState(false);

    const getLocalDateString = (date = new Date()) => {
        const datetime = new Date(date);
        if (datetime.getTime()) {
            datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset());
            return datetime.toISOString().slice(0, -1);
        }
        return "";
    };

    const getNodeConfiguration = (nextFieldName, selectedField) => {
        cobalt.getNodeConfiguration(workflow?.workflow_id, selectedItem, nextFieldName, {
            ...inputData,
            ...selectedField,
        })
        .then(data => {
            // update dynamic fields' options
            const newDynamicOptions = new Map(dynamicOptions);
            for (const field of data || []) {
                if (field.options?.length) {
                    newDynamicOptions.set(field.name, field.options);
                }
                for (const column of field.columns?.filter(c => c.isDynamic) || []) {
                    if (column.options?.length) {
                        newDynamicOptions.set(column.name, column.options);
                    }
                }
            }
            setDynamicOptions(newDynamicOptions);
        })
        .catch(console.error);
    };

    useEffect(() => {
        setWorkflow(defaultWorkflow);
        setSteps(STEPS.filter(s => defaultWorkflow?.[s.dataField]?.length));
    }, [ defaultWorkflow ]);

    useEffect(() => {
        if (workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.filter(f => f.isDynamic)?.length) {
            getNodeConfiguration(workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.filter(f => f.isDynamic)?.[0]?.name);
        }
        setInputData(Object.fromEntries(workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.map(f => ([ f.name, f.value ])) || []));
    }, [ selectedItem ]);

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
                                        {
                                            workflow?.applications?.find(a => a.app_type === selectedItem)?.help && (
                                                <div style={{
                                                    padding: 15,
                                                    backgroundColor: "rgba(33, 43, 54, .1)",
                                                    border: "1px solid #212b36",
                                                    borderRadius: 8,
                                                    color: "#212b36",
                                                    fontSize: 14,
                                                }}>
                                                    <ReactMarkdown>
                                                        { workflow?.applications?.find(a => a.app_type === selectedItem)?.help }
                                                    </ReactMarkdown>
                                                </div>
                                            )
                                        }

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
                                !workflow?.applications?.find(a => a.app_type === selectedItem)?.configured && workflow?.applications?.find(a => a.app_type === selectedItem)?.auth_input_map?.map(field =>
                                    <div key={ field.name }>
                                        <div style={{ marginBottom: 5 }}>
                                            <span>{ field.label || field.name }</span>
                                            { !field.required && <span style={{ marginLeft: 5, color: "#919eab", fontSize: 12 }}>(optional)</span> }
                                        </div>
                                        <input
                                            type={ field.type }
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
                                            value={ authData?.[field.name] }
                                            onChange={ e => setAuthData({ [field.name]: field.multiple ? e.target.value?.split(",") : e.target.value }) }
                                        />
                                    </div>
                                )
                            }

                            {
                                workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.filter(f => showOptionalFields ? true : f.required)?.map(field =>
                                    <div key={ field.name }>
                                        <div style={{ marginBottom: 5 }}>
                                            <span>{ field.label || field.name }</span>
                                            { !field.required && <span style={{ marginLeft: 5, color: "#919eab", fontSize: 12 }}>(optional)</span> }
                                        </div>
                                        {
                                            field.type === "map"
                                            ?   <React.Fragment>
                                                    {
                                                        inputData?.[field.name]?.value?.map((row, rowIndex) =>
                                                            <div key={ rowIndex } style={{
                                                                display: "flex",
                                                                gap: 8,
                                                                marginBottom: 8,
                                                            }}>
                                                                {
                                                                    field.columns?.map(column =>
                                                                        column.type === "select" || column.type === "slot_list"
                                                                        ?   <select
                                                                                name={ column.name }
                                                                                placeholder={ column.placeholder }
                                                                                required={ column.required }
                                                                                multiple={ column.multiple }
                                                                                value={ row?.[column.name] || "" }
                                                                                onChange={ e => {
                                                                                    // update cell value
                                                                                    const newRow = row || {};
                                                                                    newRow[column.name] = e.target.value;

                                                                                    // update input data value
                                                                                    const newValue = inputData[field.name]?.value?.length ? [ ...inputData[field.name]?.value ] : [];
                                                                                    newValue.splice(rowIndex, 1, newRow);

                                                                                    // update input data
                                                                                    setInputData({
                                                                                        [field.name]: {
                                                                                            ...inputData?.[field.name],
                                                                                            value: newValue,
                                                                                        },
                                                                                    });
                                                                                }}
                                                                                style={{
                                                                                    width: "100%",
                                                                                    marginBottom: column.multiple ? 2 : 0,
                                                                                    padding: 15,
                                                                                    border: "none",
                                                                                    backgroundColor: "#f9fafb",
                                                                                    borderRadius: 8,
                                                                                }}
                                                                            >
                                                                                <option hidden disabled value={ "" }>Select</option>
                                                                                {
                                                                                    column.type === "slot_list"
                                                                                    ?   workflow?.data_slots?.map(ds =>
                                                                                            <option key={ ds._id } value={ ds._id }>{ ds.name }</option>
                                                                                        )
                                                                                    :   (column.options?.length ? column.options : dynamicOptions.get(column.name))?.map(o =>
                                                                                            <option key={ o.value } value={ o.value }>{ o.name }</option>
                                                                                        )
                                                                                }
                                                                            </select>
                                                                        :   <input
                                                                                key={ column.name }
                                                                                type={ column.type === "datetime" ? "datetime-local" : column.type }
                                                                                placeholder={ column.placeholder }
                                                                                required={ column.required }
                                                                                label={ column.placeholder }
                                                                                value={ row?.[column.name] || "" }
                                                                                onChange={ e => {
                                                                                    // update cell value
                                                                                    const newRow = row || {};
                                                                                    newRow[column.name] = e.target.value;

                                                                                    // update input data value
                                                                                    const newValue = inputData?.length ? [ ...inputData[field.name]?.value ] : [];
                                                                                    newValue.splice(rowIndex, 1, newRow);

                                                                                    // update input data
                                                                                    setInputData({
                                                                                        [field.name]: {
                                                                                            ...inputData?.[field.name],
                                                                                            value: newValue,
                                                                                        },
                                                                                    });
                                                                                }}
                                                                                style={{
                                                                                    width: "100%",
                                                                                    marginBottom: field.multiple ? 2 : 0,
                                                                                    padding: 8,
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
                                                    <button
                                                        onClick={ () => {
                                                            const newField = Object.fromEntries(field.columns?.map(column => ([column.name, ""])));
                                                            const oldValue = inputData?.[field.name]?.value;
                                                            const newValue = oldValue instanceof Array ? oldValue.concat(newField) : [ newField ];

                                                            setInputData({
                                                                [field.name]: {
                                                                    ...inputData?.[field.name],
                                                                    value: newValue,
                                                                },
                                                            });
                                                        }}
                                                        style={{
                                                            padding: 5,
                                                            border: "none",
                                                            borderRadius: 8,
                                                            backgroundColor: "transparent",
                                                            color: "black",
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        + Map Fields
                                                    </button>
                                                </React.Fragment>
                                            :   field.type === "select" || field.type === "slot_list"
                                                ?   <select
                                                        name={ field.name }
                                                        placeholder={ field.placeholder }
                                                        required={ field.required }
                                                        multiple={ field.multiple }
                                                        value={ inputData?.[field.name]?.value || "" }
                                                        onChange={ e => {
                                                            // update input data
                                                            setInputData({ [field.name]: { value: field.multiple ? e.target.value?.split(",") : e.target.value }});

                                                            // get dynamic field data
                                                            if (field.isDynamic) {
                                                                const dynamicFields = workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.filter(f => f.isDynamic);
                                                                const currentFieldIndex = dynamicFields?.findIndex(f => f.name === field.name);
                                                                const nextFieldName = dynamicFields?.[(currentFieldIndex + 1) % dynamicFields?.length]?.name

                                                                getNodeConfiguration(nextFieldName, { [field.name]: { value: e.target.value }});
                                                            }
                                                        }}
                                                        style={{
                                                            width: "100%",
                                                            marginBottom: field.multiple ? 2 : 0,
                                                            padding: 15,
                                                            border: "none",
                                                            backgroundColor: "#f9fafb",
                                                            borderRadius: 8,
                                                        }}
                                                    >
                                                        <option hidden disabled value={ "" }>Select</option>
                                                        {
                                                            field.type === "slot_list"
                                                            ?   workflow?.data_slots?.map(ds =>
                                                                    <option key={ ds._id } value={ ds._id }>{ ds.name }</option>
                                                                )
                                                            :   (field.options?.length ? field.options : dynamicOptions.get(field.name))?.map(o =>
                                                                    <option key={ o.value } value={ o.value }>{ o.name }</option>
                                                                )
                                                        }
                                                    </select>
                                                :   field.type === "textarea"
                                                    ?   <textarea
                                                            placeholder={ field.placeholder }
                                                            required={ field.required }
                                                            style={{
                                                                resize: "vertical",
                                                                width: "100%",
                                                                padding: 15,
                                                                border: "none",
                                                                backgroundColor: "#f9fafb",
                                                                borderRadius: 8,
                                                            }}
                                                            onChange={ e => setInputData({ [field.name]: { value: field.multiple ? e.target.value?.split(",") : e.target.value }}) }
                                                        >
                                                            { inputData?.[field.name]?.value }
                                                        </textarea>
                                                    :   <React.Fragment>
                                                            <input
                                                                type={ field.type === "datetime" ? "datetime-local" : field.type }
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
                                                                value={ inputData?.[field.name]?.value ? getLocalDateString(inputData[field.name].value) : inputData?.[field.name]?.value }
                                                                onChange={ e => setInputData({
                                                                    [field.name]: {
                                                                        value: field.multiple ? e.target.value?.split(",") : field.type.startsWith("date") ? new Date(e.target.value).toISOString() : e.target.value,
                                                                }}) }
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
                                                        </React.Fragment>
                                        }
                                    </div>
                                )
                            }
                            {
                                workflow?.configure?.find(n => n.node_id === selectedItem)?.fields?.some(f => !f.required) && (
                                    <div
                                        onClick={ () => setShowOptionalFields(!showOptionalFields) }
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            opacity: .5,
                                            cursor: "pointer",
                                        }}
                                    >
                                        { showOptionalFields ? "Hide" : "Show" } optional fields.
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
