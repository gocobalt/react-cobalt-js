import React, { useContext, useEffect, useState } from "react";
import { Alert } from "@mui/joy";

import { Context as CobaltContext } from "../Provider";
import Field from "../Field";
import Dialog from "../ui/Dialog";
import ErrorComponent from "../ui/Error";
import Loader from "../ui/Loader";
import Workflow from "../ui/Workflow";

/**
 * @param {Object} props
 * @param {String} props.slug Application Slug
 * @param {String} props.id Config ID
 * @param {Object} props.labels Dynamic Labels
 * @param {Function} props.onConnect
 * @param {Function} props.onClose
 * @param {boolean} props.removeBranding
 * @param {Record.<string, unknown>} props.style
 */
const Config = ({
    open,
    onOpenChange,

    slug,
    id,
    labels,
    onConnect = () => {},
    onDisconnect = () => {},
    onSave = () => {},
    style = {},
    removeBranding,
}) => {
    const { cobalt, sessionToken } = useContext(CobaltContext);
    const [ config, setConfig ] = useState(null);
    const [ application, setApplication ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ loadingConfig, setLoadingConfig ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ inputData, setInputData ] = useState({});
    const [ appInputData, setAppInputData ] = useState({});
    const [ workflowsInputData, setWorkflowsInputData ] = useState({});
    const [ enabledWorkflows, setEnabledWorkflows ] = useState([]);

    const getRuleOptions = (lhs, fieldId, workflowId) => {
        if (!lhs) return; // NOTE: maybe reset the options for the field id?
        if (!fieldId) return;

        cobalt.token = sessionToken;

        cobalt.getRuleFieldOptions(lhs, slug, fieldId, workflowId)
        .then(res => {
            const newConfig = { ...config };

            if (workflowId) {
                const workflowIndex = newConfig.workflows?.findIndex(wf => wf.id === workflowId);
                const fieldIndex = newConfig.workflows?.[workflowIndex]?.fields?.findIndex(f => f.id === fieldId);
                newConfig.workflows[workflowIndex].fields[fieldIndex] = {
                    ...newConfig.workflows?.[workflowIndex].fields?.[fieldIndex],
                    rule_columns: {
                        ...newConfig.workflows?.[workflowIndex].fields?.[fieldIndex]?.rule_columns,
                        [lhs]: res.rule_column,
                    },
                };
            } else {
                const fieldIndex = newConfig.fields?.findIndex(f => f.id === fieldId);
                newConfig.fields[fieldIndex] = {
                    ...newConfig.fields?.[fieldIndex],
                    rule_columns: {
                        ...newConfig.fields?.[fieldIndex]?.rule_columns,
                        [lhs]: res.rule_column,
                    },
                };
            }

            setConfig(newConfig);
        })
        .catch(console.error);
    };

    const toggleWorkflow = (workflowId) => {
        if (enabledWorkflows.includes(workflowId)) {
            setEnabledWorkflows(enabledWorkflows.filter(id => id !== workflowId));
        } else {
            setEnabledWorkflows(enabledWorkflows.concat(workflowId));
        }
    };

    const handleUpdate = () => {
        cobalt.token = sessionToken;

        cobalt.updateConfig({
            slug,
            config_id: id,
            fields: appInputData,
            workflows: config?.workflows?.map(workflow => ({
                id: workflow.id,
                enabled: enabledWorkflows.includes(workflow.id),
                fields: workflowsInputData[workflow.id] || [],
            })) || [],
        })
        .then(config => {
            setConfig(config);
            // clear previous error message
            setErrorMessage(null);
            // call the `onSave` callback function
            typeof onSave === "function" && onSave();
            typeof onOpenChange === "function" && onOpenChange(false);
        })
        .catch(() => setErrorMessage("Unable to save the data. Please try again later."));
    };

    const handleConnect = () => {
        cobalt.token = sessionToken;

        cobalt.connect(slug, inputData)
        .then(connected => {
            if (connected) {
                // update connection status
                setApplication({ ...application, connected: true, reauth_required: false });
                // clear previous error message
                setErrorMessage(null);
                // call the `onConnect` callback function
                typeof onConnect === "function" && onConnect();
            } else {
                setErrorMessage(`Unable to connect your ${ application.name } account. Please try again later.`);
            }
        })
        .catch(() => setErrorMessage(`Unable to connect your ${ application.name } account. Please try again later.`));
    };

    const handleDisconnect = () => {
        cobalt.token = sessionToken;

        cobalt.disconnect(slug)
        .then(() => {
            // update connection status
            setApplication({ ...application, connected: false, reauth_required: undefined });
            // clear previous error message
            setErrorMessage(null);
            // call the `onDisconnect` callback function
            typeof onDisconnect === "function" && onDisconnect()
        })
        .catch(() => setErrorMessage(`Unable to disconnect your ${ application.name } account. Please try again later.`));
    };

    useEffect(() => {
        if (!sessionToken) return;

        cobalt.token = sessionToken;

        if (slug) {
            setLoading(true);
            setErrorMessage(null);

            cobalt.getApp(slug)
            .then(data => setApplication(data))
            .catch(e => {
                console.error(e);
                setError({
                    title: "Application Error",
                    message: `Make sure the application "${ slug }" exists and is enabled.`,
                });
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [ sessionToken, slug ]);

    useEffect(() => {
        if (!sessionToken) return;
        if (!application?.connected) return;

        cobalt.token = sessionToken;

        if (slug) {
            setLoadingConfig(true);
            setErrorMessage(null);

            cobalt.config({
                slug,
                config_id: id,
                labels,
            })
            .then(config => {
                setConfig(config);

                // populate input fields
                const appDataSlots = {};
                for (const ds of config?.fields || []) {
                    if (typeof ds.value !== "undefined") {
                        appDataSlots[ds.id] = ds.value;
                    }
                }
                setAppInputData(appDataSlots);

                const workflowDataSlots = {};
                const enabledWorkflows = [];
                for (const workflow of config?.workflows || []) {
                    if (!(workflow.id in workflowDataSlots)) {
                        workflowDataSlots[workflow.id] = {};
                    }

                    if (workflow.enabled) {
                        enabledWorkflows.push(workflow.id);
                    }

                    for (const ds of workflow.fields) {
                        if (typeof ds.value !== "undefined") {
                            workflowDataSlots[workflow.id][ds.id] = ds.value;
                        }
                    }
                }
                setWorkflowsInputData(workflowDataSlots);
                setEnabledWorkflows(enabledWorkflows);
            })
            .catch(e => {
                console.error(e);
                setError({
                    title: "Config Error",
                    message: `Unable to get the config for the application "${ slug }", try again later.`,
                });
            })
            .finally(() => {
                setLoadingConfig(false);
            });
        }
    }, [ sessionToken, id, slug, application?.connected ]);

    if (error) {
        return (
            <Dialog
                empty
                open={ open }
                onOpenChange={ onOpenChange }
            >
                <ErrorComponent
                    title={ error.title }
                    message={ error.message }
                />
            </Dialog>
        );
    }

    if (loading) {
        return (
            <Dialog
                empty
                open={ open }
                onOpenChange={ onOpenChange }
            >
                <Loader />
            </Dialog>
        );
    }

    if (application?.name) {
        return (
            <Dialog
                loading={ loading }
                icon={ application.icon }
                title={ application.name }
                description={ application.description }
                open={ open }
                onOpenChange={ onOpenChange }
                action={ application.connected ? application.reauth_required ? "Reconnect" : "Save" : "Connect" }
                onAction={ application.connected && !application.reauth_required ? handleUpdate : handleConnect }
                secondaryAction={ application.connected && "Disconnect" }
                onSecondaryAction={ application.connected && handleDisconnect }
            >
                {
                    application?.connected && !application.reauth_required
                    ?   loadingConfig
                        ?   <Loader />
                        :   <React.Fragment>
                                {
                                    !!config?.fields?.length && (
                                        config.fields.map(dataslot =>
                                            <Field
                                                key={ dataslot.id }
                                                type={ dataslot.field_type }
                                                name={ dataslot.name }
                                                description={ dataslot.help_text }
                                                required={ dataslot.required }
                                                multiple={ dataslot.multiple }
                                                placeholder={ dataslot.placeholder }
                                                options={ dataslot.options }
                                                labels={ dataslot.labels }
                                                value={ typeof appInputData?.[dataslot.id] !== "undefined" ? appInputData[dataslot.id] : "" }
                                                onChange={ value => setAppInputData({ ...appInputData, [dataslot.id]: value }) }
                                                // rule props
                                                ruleColumns={ dataslot.rule_columns }
                                                onLHSChange={ lhs => getRuleOptions(lhs, dataslot.id) }
                                            />
                                        )
                                    )
                                }

                                {
                                    config?.workflows?.map(workflow =>
                                        <Workflow
                                            key={ workflow.id }
                                            title={ workflow.name }
                                            description={ workflow.description }
                                            enabled={ enabledWorkflows.includes(workflow.id) }
                                            onEnabledChange={ () => toggleWorkflow(workflow.id) }
                                        >
                                            {
                                                workflow?.fields.map(dataslot =>
                                                    <Field
                                                        key={ dataslot.id }
                                                        type={ dataslot.field_type }
                                                        name={ dataslot.name }
                                                        description={ dataslot.help_text }
                                                        required={ dataslot.required }
                                                        multiple={ dataslot.multiple }
                                                        placeholder={ dataslot.placeholder }
                                                        options={ dataslot.options }
                                                        labels={ dataslot.labels }
                                                        value={ typeof workflowsInputData?.[workflow.id]?.[dataslot.id] !== "undefined" ? workflowsInputData?.[workflow.id]?.[dataslot.id] : "" }
                                                        onChange={ value => {
                                                            setWorkflowsInputData({
                                                                ...workflowsInputData,
                                                                [workflow.id]: {
                                                                    ...workflowsInputData?.[workflow.id],
                                                                    [dataslot.id]: value,
                                                                },
                                                            });
                                                        }}
                                                        // rule props
                                                        ruleColumns={ dataslot.rule_columns }
                                                        onLHSChange={ lhs => getRuleOptions(lhs, dataslot.id, workflow.id) }
                                                    />
                                                )
                                            }
                                        </Workflow>
                                    )
                                }

                                {
                                    errorMessage && (
                                        <Alert color="danger">{ errorMessage }</Alert>
                                    )
                                }
                            </React.Fragment>
                    :   <React.Fragment>
                            {
                                application.help && (
                                    <Alert>
                                        { application.help }
                                    </Alert>
                                )
                            }

                            {
                                !!application.auth_input_map?.length && (
                                    application.auth_input_map?.map(field =>
                                        <Field
                                            key={ field.name }
                                            type={ field.type }
                                            required={ field.required }
                                            multiple={ field.multiple }
                                            name={ field.label }
                                            description={ field.help_text }
                                            placeholder={ field.placeholder }
                                            options={ field.options }
                                            value={ inputData?.[field.name] || "" }
                                            onChange={ value => setInputData({ ...inputData, [field.name]: value }) }
                                        />
                                    )
                                )
                            }

                            {
                                errorMessage && (
                                    <Alert color="danger">{ errorMessage }</Alert>
                                )
                            }
                        </React.Fragment>
                }
            </Dialog>
        );
    }

    return null;
};


export default Config;
