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
    const [ error, setError ] = useState(null);

    useEffect(() => {
        cobalt.token = sessionToken;

        cobalt.installTemplate(templateId)
        .then(data => setWorkflow(data))
        .catch(e => {
            console.error(e);
            setError({
                title: "Install Error",
                message: "Error when trying to install the workflow. Please try again.",
            });
        });
    }, [ sessionToken ]);

    if (error) {
        return <ErrorComponent title={ error.title } message={ error.message } />;
    }

    return (
        <Provider>
            <div style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 360,
                minHeight: 420,
                maxHeight: 750,
                ...style,
            }}>
                <Header />
                <Content workflow={ workflow } />
                <Footer
                    disabled={ false }
                />
            </div>
        </Provider>
    );
};

export default Installer;
