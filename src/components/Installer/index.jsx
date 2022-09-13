import React, { useContext, useEffect, useState } from "react";

import { Context as SessionContext } from "../Provider";
import { Provider } from "./Provider";
import Content from "./Content";
import ErrorComponent from "./Error";
import Footer from "./Footer";
import Header from "./Header";

const Installer = ({ templateId, style }) => {
    const { cobalt, sessionToken } = useContext(SessionContext);
    const [ workflow, setWorkflow ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        setLoading(true);
        cobalt.token = sessionToken;

        cobalt.installTemplate(templateId)
        .then(data => setWorkflow(data))
        .catch(e => {
            console.error(e);
            setError({
                title: "Install Error",
                message: "Error when trying to install the workflow. Please try again.",
            });
        })
        .finally(() => {
            setLoading(false);
        });
    }, [ sessionToken ]);

    if (error) {
        return <ErrorComponent title={ error.title } message={ error.message } />;
    }

    if (loading) {
        return (
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 25,
            }}>
                <img
                    src="https://i.imgur.com/nEm368w.gif"
                    width={ 50 }
                    height={ 50 }
                />
            </div>
        );
    }

    return (
        <Provider>
            <div style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 360,
                maxWidth: 360,
                minHeight: 420,
                maxHeight: 750,
                ...style,
            }}>
                <Header />
                <Content workflow={ workflow } />
                <Footer
                    disabled={ workflow?.applications?.some(app => !app.configured) }
                />
            </div>
        </Provider>
    );
};

export default Installer;
