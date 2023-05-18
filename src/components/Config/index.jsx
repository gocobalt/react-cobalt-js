import React, { useContext, useEffect, useState } from "react";
import { Alert, Avatar, Button, Divider, Input, Option, Select, Sheet, Stack, Switch, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";

import { Context as CobaltContext, Provider } from "../Provider";
import ErrorComponent from "../Error";
import Loader from "../Loader";

/**
 * @param {Object} props
 * @param {String} props.slug Application Slug
 * @param {String} props.id Config ID
 * @param {Object} props.fields Dynamic Fields
 * @param {Function} props.onConnect
 * @param {Function} props.onClose
 * @param {Record.<string, unknown>} props.style
 */
const Config = ({
    slug,
    id,
    fields,
    onConnect = () => {},
    onDisconnect = () => {},
    onSave = () => {},
    onDelete = () => {},
    style = {},
}) => {
    const { cobalt, sessionToken } = useContext(CobaltContext);
    const [ config, setConfig ] = useState(null);

    const [ application, setApplication ] = useState(null);
    const [ loading, setLoading ] = useState(false);
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
        cobalt.updateConfig(slug, id, {
            config_id: id,
            application_data_slots: appInputData,
            workflows: config?.workflows?.map(workflow => ({
                id: workflow.id,
                enabled: enabledWorkflows.includes(workflow.id),
                data_slots: workflowsInputData[workflow.id] || [],
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

    const handleDelete = () => {
        cobalt.deleteConfig(slug, id)
        .then(() => {
            setConfig(null);
            // clear previous error message
            setErrorMessage("Data has been deleted.");
            // call the `onDelete` callback function
            typeof onDelete === "function" && onDelete();
        })
        .catch(() => setErrorMessage("Unable to delete the data. Please try again later."));
    };

    const handleConnect = () => {
        cobalt.connect(slug, application.auth_type?.startsWith("oauth") ? undefined : inputData)
        .then(connected => {
            if (connected) {
                // update connection status
                setApplication({ ...application, connected: true });
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
        cobalt.disconnect(slug)
        .then(() => {
            // update connection status
            setApplication({ ...application, connected: false });
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

        if (id && slug) {
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

            cobalt.config(slug, id, fields)
            .then(config => {
                setConfig(config);

                // populate input fields
                const appDataSlots = {};
                for (const ds of config?.application_data_slots || []) {
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

                    for (const ds of workflow.data_slots) {
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
                setLoading(false);
            });
        }
    }, [ sessionToken, id, slug ]);

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
                            <Avatar
                                variant="rounded"
                                src={ application.icon }
                                sx={{ height: 50, width: 50 }}
                            />
                            <Stack>
                                <Typography fontSize="xl" fontWeight="lg">{ application.name }</Typography>
                                <Typography color="neutral">{ application.description }</Typography>
                            </Stack>
                        </Stack>

                        <Divider />

                        <Tabs defaultValue={ 0 }>
                            <TabList>
                                <Tab>Connect</Tab>
                                <Tab disabled={ !application.connected }>Configure</Tab>
                            </TabList>

                            <TabPanel value={ 0 } sx={{ mt: 3 }}>
                                <Stack spacing={ 3 }>
                                    {
                                        !application.connected && !!application.auth_input_map?.length && (
                                            <React.Fragment>
                                                {
                                                    application.auth_input_map?.map(field =>
                                                        <Stack key={ field.name } spacing={ 1 }>
                                                            <Typography>{ field.label }</Typography>
                                                            <Typography color="neutral">{ field.help_text }</Typography>
                                                            <Input
                                                                name={ field.name }
                                                                type={ field.type }
                                                                placeholder={ field.placeholder }
                                                                value={ inputData?.[field.name] || "" }
                                                                onChange={ e => setInputData({ ...inputData, [field.name]: e.target.value })}
                                                            />
                                                        </Stack>
                                                    )
                                                }
                                                <Divider />
                                            </React.Fragment>
                                        )
                                    }

                                    <Stack spacing={ 2 }>
                                        {
                                            errorMessage && (
                                                <Alert color="danger">{ errorMessage }</Alert>
                                            )
                                        }

                                        <Button
                                            color={ application.connected ? "danger" : "success" }
                                            onClick={ application.connected ? handleDisconnect : handleConnect }
                                        >
                                            { application.connected ? "Disconnect" : "Connect" }
                                        </Button>
                                    </Stack>
                                </Stack>
                            </TabPanel>

                            <TabPanel value={ 1 } sx={{ mt: 3 }}>
                                <Stack spacing={ 3 }>
                                    {
                                        !!config?.application_data_slots?.length && (
                                            <React.Fragment>
                                                {
                                                    config.application_data_slots?.map(dataslot =>
                                                        <Stack key={ dataslot.id } spacing={ 1 }>
                                                            <Stack direction="row" alignItems="center" gap={ 1 }>
                                                                <Typography fontWeight="md">{ dataslot.name }</Typography>
                                                                { !dataslot.required && <Typography fontSize="sm" color="neutral">(optional)</Typography> }
                                                            </Stack>
                                                            {
                                                                dataslot.field_type === "map"
                                                                ?   <Stack spacing={ 1 }>
                                                                        {
                                                                            dataslot.labels?.map(label =>
                                                                                <Stack key={ label.value } direction="row" alignItems="center" spacing={ 1 }>
                                                                                    <Typography flex={ 1 }>{ label.name }</Typography>
                                                                                    <Select
                                                                                        name={ dataslot.name }
                                                                                        placeholder={ dataslot.placeholder || "Select" }
                                                                                        value={ typeof appInputData[dataslot.id]?.[label.value] !== "undefined" ? appInputData[dataslot.id]?.[label.value] : "" }
                                                                                        onChange={ (_, v) => {
                                                                                            setAppInputData({
                                                                                                ...appInputData,
                                                                                                [dataslot.id]: {
                                                                                                    ...appInputData[dataslot.id],
                                                                                                    [label.value]: v,
                                                                                                },
                                                                                            });
                                                                                        }}
                                                                                        sx={{ flex: 1 }}
                                                                                    >
                                                                                        {
                                                                                            dataslot.options?.map(option =>
                                                                                                <Option key={ option.value } value={ option.value }>{ option.name }</Option>
                                                                                            )
                                                                                        }
                                                                                    </Select>
                                                                                </Stack>
                                                                            )
                                                                        }
                                                                    </Stack>
                                                                :   dataslot.field_type === "select"
                                                                    ?   <Select
                                                                            name={ dataslot.id }
                                                                            placeholder={ dataslot.placeholder }
                                                                            value={ typeof appInputData?.[dataslot.id] !== "undefined" ? appInputData[dataslot.id] : "" }
                                                                            onChange={ (_, v) => setAppInputData({ ...appInputData, [dataslot.id]: v }) }
                                                                        >
                                                                            {
                                                                                dataslot.options?.map(option =>
                                                                                    <Option key={ option.value } value={ option.value }>{ option.name }</Option>
                                                                                )
                                                                            }
                                                                        </Select>
                                                                    :   dataslot.field_type === "textarea"
                                                                        ?   <Textarea
                                                                                minRows={ 3 }
                                                                                name={ dataslot.id }
                                                                                placeholder={ dataslot.placeholder }
                                                                                value={ typeof appInputData?.[dataslot.id] !== "undefined" ? appInputData[dataslot.id] : "" }
                                                                                onChange={ e => setAppInputData({ ...appInputData, [dataslot.id]: e.target.value }) }
                                                                            />
                                                                        :   <Input
                                                                                name={ dataslot.id }
                                                                                type={ dataslot.field_type }
                                                                                placeholder={ dataslot.placeholder }
                                                                                value={ typeof appInputData?.[dataslot.id] !== "undefined" ? appInputData[dataslot.id] : "" }
                                                                                onChange={ e => setAppInputData({ ...appInputData, [dataslot.id]: e.target.value }) }
                                                                            />
                                                            }
                                                        </Stack>
                                                    )
                                                }
                                                <Divider />
                                            </React.Fragment>
                                        )
                                    }

                                    {
                                        !!config?.workflows?.length && (
                                            config?.workflows?.map(workflow =>
                                                <React.Fragment key={ workflow.id }>
                                                    <Stack spacing={ 2 }>
                                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                            <Typography fontSize="md" fontWeight="lg">{ workflow.name }</Typography>
                                                            <Switch
                                                                size="sm"
                                                                checked={ enabledWorkflows.includes(workflow.id) }
                                                                onChange={ () => toggleWorkflow(workflow.id) }
                                                            />
                                                        </Stack>
                                                        {
                                                            enabledWorkflows.includes(workflow.id) && workflow?.data_slots.map(dataslot =>
                                                                <Stack key={ dataslot.id } spacing={ 1 }>
                                                                    <Stack direction="row" alignItems="center" gap={ 1 }>
                                                                        <Typography fontWeight="md">{ dataslot.name }</Typography>
                                                                        { !dataslot.required && <Typography fontSize="sm" color="neutral">(optional)</Typography> }
                                                                    </Stack>
                                                                    {
                                                                        dataslot.field_type === "map"
                                                                        ?   <Stack spacing={ 1 }>
                                                                                {
                                                                                    dataslot.labels?.map(label =>
                                                                                        <Stack key={ label.value } direction="row" alignItems="center" spacing={ 1 }>
                                                                                            <Typography flex={ 1 }>{ label.name }</Typography>
                                                                                            <Select
                                                                                                name={ dataslot.name }
                                                                                                placeholder={ dataslot.placeholder || "Select" }
                                                                                                value={ typeof workflowsInputData[workflow.id]?.[dataslot.id]?.[label.value] !== "undefined" ? workflowsInputData[workflow.id]?.[dataslot.id]?.[label.value] : "" }
                                                                                                onChange={ (_, v) => {
                                                                                                    setWorkflowsInputData({
                                                                                                        ...workflowsInputData,
                                                                                                        [workflow.id]: {
                                                                                                            ...workflowsInputData?.[workflow.id],
                                                                                                            [dataslot.id]: {
                                                                                                                ...workflowsInputData?.[workflow.id]?.[dataslot.id],
                                                                                                                [label.value]: v,
                                                                                                            },
                                                                                                        },
                                                                                                    });
                                                                                                }}
                                                                                                sx={{ flex: 1 }}
                                                                                            >
                                                                                                {
                                                                                                    dataslot.options?.map(option =>
                                                                                                        <Option key={ option.value } value={ option.value }>{ option.name }</Option>
                                                                                                    )
                                                                                                }
                                                                                            </Select>
                                                                                        </Stack>
                                                                                    )
                                                                                }
                                                                            </Stack>
                                                                        :   dataslot.field_type === "select"
                                                                            ?   <Select
                                                                                    name={ dataslot.id }
                                                                                    placeholder={ dataslot.placeholder }
                                                                                    value={ typeof workflowsInputData?.[workflow.id]?.[dataslot.id] !== "undefined" ? workflowsInputData?.[workflow.id]?.[dataslot.id] : "" }
                                                                                    onChange={ (_, v) => {
                                                                                        setWorkflowsInputData({
                                                                                            ...workflowsInputData,
                                                                                            [workflow.id]: {
                                                                                                ...workflowsInputData?.[workflow.id],
                                                                                                [dataslot.id]: v,
                                                                                            },
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        dataslot.options?.map(option =>
                                                                                            <Option key={ option.value } value={ option.value }>{ option.name }</Option>
                                                                                        )
                                                                                    }
                                                                                </Select>
                                                                            :   dataslot.field_type === "textarea"
                                                                                ?   <Textarea
                                                                                        minRows={ 3 }
                                                                                        name={ dataslot.id }
                                                                                        placeholder={ dataslot.placeholder }
                                                                                        value={ typeof workflowsInputData?.[workflow.id]?.[dataslot.id] !== "undefined" ? workflowsInputData?.[workflow.id]?.[dataslot.id] : "" }
                                                                                        onChange={ e => {
                                                                                            setWorkflowsInputData({
                                                                                                ...workflowsInputData,
                                                                                                [workflow.id]: {
                                                                                                    ...workflowsInputData?.[workflow.id],
                                                                                                    [dataslot.id]: e.target.value,
                                                                                                },
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                :   <Input
                                                                                        name={ dataslot.id }
                                                                                        type={ dataslot.field_type }
                                                                                        placeholder={ dataslot.placeholder }
                                                                                        value={ typeof workflowsInputData?.[workflow.id]?.[dataslot.id] !== "undefined" ? workflowsInputData?.[workflow.id]?.[dataslot.id] : "" }
                                                                                        onChange={ e => {
                                                                                            setWorkflowsInputData({
                                                                                                ...workflowsInputData,
                                                                                                [workflow.id]: {
                                                                                                    ...workflowsInputData?.[workflow.id],
                                                                                                    [dataslot.id]: e.target.value,
                                                                                                },
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                    }
                                                                </Stack>
                                                            )
                                                        }
                                                    </Stack>
                                                    <Divider />
                                                </React.Fragment>
                                            )
                                        )
                                    }

                                    <Stack spacing={ 2 }>
                                        {
                                            errorMessage && (
                                                <Alert color="danger">{ errorMessage }</Alert>
                                            )
                                        }

                                        <Stack spacing={ 1 }>
                                            <Button onClick={ handleUpdate }>
                                                Save
                                            </Button>
                                            <Button color="danger" onClick={ handleDelete }>
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </TabPanel>
                        </Tabs>

                        <a href="https://gocobalt.io" target="_blank" style={{ textDecoration: "none" }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={ 1 }>
                                <img src="https://app.gocobalt.io/favicon.png" height={ 18 } width={ 18 } />
                                <Typography fontSize="sm" color="neutral" fontWeight="md" lineHeight={ 1.5 }>Powered by Cobalt</Typography>
                            </Stack>
                        </a>
                    </Stack>
                </Sheet>
            </Provider>
        );
    }

    return null;
};

const styles = {
    container: {
        padding: 3,
    },
};

export default Config;
