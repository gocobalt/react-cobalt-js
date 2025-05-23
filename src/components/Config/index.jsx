import React, { useContext, useEffect, useState } from "react";
import { Alert, AspectRatio, Button, Chip, Divider, Sheet, Stack, Switch, Typography } from "@mui/joy";

import { Context as CobaltContext, Provider } from "../Provider";
import ErrorComponent from "../Error";
import Loader from "../Loader";
import Field from "../Field";

const Branding = () => (
    <a href="https://gocobalt.io" target="_blank" style={{ textDecoration: "none" }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={ 1 }>
            <AspectRatio variant="plain" ratio="1/1" sx={{ width: 18, borderRadius: 2 }}>
                <img src="https://app.gocobalt.io/favicon.png" height={ 18 } width={ 18 } />
            </AspectRatio>
            <Typography fontSize="sm" color="neutral" fontWeight="md" lineHeight={ 1.5 }>Powered by Cobalt</Typography>
        </Stack>
    </a>
);

/**
 * @param {Object} props
 * @param {String} [props.slug] Application Slug
 * @param {String} props.id Config ID
 * @param {Object} props.labels Dynamic Labels
 * @param {Function} props.onConnect
 * @param {Function} props.onClose
 * @param {boolean} props.removeBranding
 * @param {Record.<string, unknown>} props.style
 */
const Config = ({
    id,
    labels,
    onConnect = () => {},
    onDisconnect = () => {},
    onSave = () => {},
    style = {},
    removeBranding,
    ...props
}) => {
    const { cobalt, sessionToken } = useContext(CobaltContext);
    const [ slug, setSlug ] = useState(props.slug);
    const [ config, setConfig ] = useState(null);
    const [ applications, setApplications ] = useState([]);
    const [ application, setApplication ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ loadingConfig, setLoadingConfig ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ inputData, setInputData ] = useState({});
    const [ appInputData, setAppInputData ] = useState({});
    const [ workflowsInputData, setWorkflowsInputData ] = useState({});
    const [ enabledWorkflows, setEnabledWorkflows ] = useState([]);

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

    const sortApplications = (a, b) => {
        const getPriority = (app) => {
            if (app.connected && !app.reauth_required) return 1
            if (app.connected && app.reauth_required) return 2;
            if (!app.connected && !app.ecosystem) return 3;
            if (app.ecosystem) return 4;
            return 5;
        };

        const priorityA = getPriority(a);
        const priorityB = getPriority(b);

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        return a.name.localeCompare(b.name);
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
        } else {
            setLoading(true);
            setErrorMessage(null);

            cobalt.getApps()
            .then(apps => setApplications(apps))
            .catch(e => {
                console.error(e);
                setError({
                    title: "Application Error",
                    message: `Unable to get the applications. Please try again later.`,
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
            <Sheet sx={{ ...styles.container, ...style }}>
                <ErrorComponent
                    title={ error.title }
                    message={ error.message }
                />
            </Sheet>
        );
    }

    if (loading) {
        return (
            <Sheet sx={{ ...styles.container, ...style }}>
                <Loader />
            </Sheet>
        );
    }

    if (application?.name) {
        return (
            <Provider>
                <Sheet sx={{ ...styles.container, ...style }}>
                    <Stack spacing={ 3 }>
                        <Stack direction="row" alignItems="center" spacing={ 2 }>
                            <AspectRatio variant="plain" ratio="1/1" sx={{ width: 50, borderRadius: 8 }}>
                                <img src={ application.icon } />
                            </AspectRatio>
                            <Stack flex={ 1 }>
                                <Typography fontSize="lg" fontWeight="lg">{ application.name }</Typography>
                                <Typography color="neutral" fontSize="sm">{ application.description?.length > 100 ? application.description.slice(0, 100) + "..." : application.description  }</Typography>
                            </Stack>
                        </Stack>

                        <Divider />

                        <Stack spacing={ 3 }>
                            {
                                application.connected && !application.reauth_required
                                ?   loadingConfig
                                    ?   <Loader />
                                    :   <React.Fragment>
                                            <Alert color="success" variant="outlined">
                                                <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                                                    <Typography fontSize="sm" fontWeight="lg" color="success">Connected</Typography>
                                                    <Button
                                                        variant="plain"
                                                        color="danger"
                                                        onClick={ handleDisconnect }
                                                    >
                                                        Disconnect
                                                    </Button>
                                                </Stack>
                                            </Alert>

                                            {
                                                !!config?.fields?.length && (
                                                    <Sheet variant="outlined" sx={{ p: 3, borderRadius: 8 }}>
                                                        <Stack spacing={ 3 }>
                                                            {
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
                                                                    />
                                                                )
                                                            }
                                                        </Stack>
                                                    </Sheet>
                                                )
                                            }

                                            {
                                                config?.workflows?.map(workflow =>
                                                    <Sheet key={ workflow.id } variant="outlined" sx={{ p: 3, borderRadius: 8, backgroundColor: "#f9fafb" }}>
                                                        <Stack spacing={ 3 }>
                                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                                <Typography fontSize="md" fontWeight="lg" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{ workflow.name }</Typography>
                                                                <Switch
                                                                    size="sm"
                                                                    variant="solid"
                                                                    checked={ enabledWorkflows.includes(workflow.id) }
                                                                    onChange={ () => toggleWorkflow(workflow.id) }
                                                                />
                                                            </Stack>
                                                            {
                                                                enabledWorkflows.includes(workflow.id) && workflow?.fields.map(dataslot =>
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
                                                                    />
                                                                )
                                                            }
                                                        </Stack>
                                                    </Sheet>
                                                )
                                            }

                                            <Stack spacing={ 2 }>
                                                {
                                                    errorMessage && (
                                                        <Alert color="danger">{ errorMessage }</Alert>
                                                    )
                                                }

                                                <Divider />

                                                <Stack spacing={ 1 }>
                                                    <Button size="lg" onClick={ handleUpdate }>
                                                        Save
                                                    </Button>
                                                </Stack>
                                            </Stack>
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
                                                <Sheet variant="outlined" sx={{ p: 3, borderRadius: 8 }}>
                                                    <Stack spacing={ 3 }>
                                                        {
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
                                                        }
                                                    </Stack>
                                                </Sheet>
                                            )
                                        }

                                        <Stack spacing={ 2 }>
                                            {
                                                errorMessage && (
                                                    <Alert color="danger">{ errorMessage }</Alert>
                                                )
                                            }

                                            <Divider />

                                            <Button
                                                size="lg"
                                                color={ application.connected ? application.reauth_required ? "warning" : "danger" : "primary" }
                                                onClick={ application.connected && !application.reauth_required ? handleDisconnect : handleConnect }
                                            >
                                                { application.connected ? application.reauth_required ? "Reconnect" : "Disconnect" : "Connect" }
                                            </Button>
                                        </Stack>
                                    </React.Fragment>
                            }
                        </Stack>

                        {
                            !removeBranding && (
                                <Branding />
                            )
                        }
                    </Stack>
                </Sheet>
            </Provider>
        );
    }

    return (
        <Provider>
            <Sheet sx={{ ...styles.container, ...style }}>
                <Stack spacing={ 3 }>
                    <Stack direction="row" alignItems="center" spacing={ 2 }>
                        <Stack flex={ 1 }>
                            <Typography fontSize="lg" fontWeight="lg">Applications</Typography>
                            <Typography color="neutral" fontSize="sm">Select the application you want to integrate.</Typography>
                        </Stack>
                    </Stack>

                    <Divider />

                    <Stack spacing={ 2 }>
                        {
                            applications?.filter(app => !app.ecosystem)?.length
                            ?   applications.filter(app => !app.ecosystem).sort(sortApplications).map(app =>
                                    <Sheet
                                        key={ app.slug || app.type }
                                        variant="outlined"
                                        onClick={ () => setSlug(app.slug || app.type) }
                                        sx={{
                                            p: 1,
                                            borderRadius: 8,
                                            cursor: "pointer",
                                            "&:hover": {
                                                bgcolor: "neutral.100",
                                            },
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={ 1 }>
                                            <Stack direction="row" alignItems="center" spacing={ 1 }>
                                                <AspectRatio variant="plain" ratio="1/1" sx={{ width: 40, borderRadius: 4 }}>
                                                    <img src={ app.icon } />
                                                </AspectRatio>
                                                <Typography fontSize="md" fontWeight="lg" sx={{ flex: 1, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{ app.name }</Typography>
                                            </Stack>
                                            {
                                                app.connected && (
                                                    app.reauth_required
                                                    ?   <Chip size="sm" color="danger">Expired</Chip>
                                                    :   <Chip size="sm" color="success">Connected</Chip>
                                                )
                                            }
                                        </Stack>
                                    </Sheet>
                                )
                            :   <Alert color="danger">No applications are currently available for integration.</Alert>
                        }
                    </Stack>

                    {
                        !removeBranding && (
                            <Branding />
                        )
                    }
                </Stack>
            </Sheet>
        </Provider>
    );
};

const styles = {
    container: {
        padding: 3,
    },
};

export default Config;
