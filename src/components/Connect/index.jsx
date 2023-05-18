import React, { useContext, useEffect, useState } from "react";
import { Alert, Avatar, Button, Divider, Input, Sheet, Stack, Typography } from "@mui/joy";

import { Context as CobaltContext, Provider } from "../Provider";
import ErrorComponent from "../Error";
import Loader from "../Loader";

/**
 * @param {Object} props
 * @param {String} props.slug Application Slug
 * @param {Function} props.onConnect
 * @param {Function} props.onClose
 * @param {Record.<string, unknown>} props.style
 */
const Connect = ({
    slug,
    onConnect = () => {},
    onDisconnect = () => {},
    style = {},
}) => {
    const { cobalt, sessionToken } = useContext(CobaltContext);
    const [ application, setApplication ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ inputData, setInputData ] = useState({});

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

                        {
                            !application.connected && !!application.auth_input_map?.length && (
                                <React.Fragment>
                                    {
                                        application.auth_input_map?.map(field =>
                                            <Stack key={ field.name } spacing={ 1 }>
                                                <Typography>{ field.label }</Typography>
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
                                    <Alert color="danger">
                                        { errorMessage }
                                    </Alert>
                                )
                            }

                            <Button
                                color={ application.connected ? "danger" : "success" }
                                onClick={ application.connected ? handleDisconnect : handleConnect }
                            >
                                { application.connected ? "Disconnect" : "Connect" }
                            </Button>

                            <a href="https://gocobalt.io" target="_blank" style={{ textDecoration: "none" }}>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={ 1 }>
                                    <img src="https://app.gocobalt.io/favicon.png" height={ 18 } width={ 18 } />
                                    <Typography fontSize="sm" color="neutral" fontWeight="md" lineHeight={ 1.5 }>Powered by Cobalt</Typography>
                                </Stack>
                            </a>
                        </Stack>
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

export default Connect;
