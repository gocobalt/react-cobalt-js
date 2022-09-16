import React, { useEffect, useState } from "react";
// import the Cobalt Provider & Installer components
import { Provider as CobaltProvider, Installer as CobaltInstaller } from "@cobaltio/react-cobalt-js";

const App = () => {
    const [ cobaltToken, setCobaltToken ] = useState(null);
    const [ templates, setTemplates ] = useState([]);
    const [ selectedTemplate, setSelectedTemplate ] = useState(null);

    // generate cobalt session token using cobalt backend sdk
    const generateCobaltToken = () => {
        fetch("/api/token", {
            method: "POST",
            body: JSON.stringify({
                user: localStorage.getItem("LINKED_ACCOUNT_ID"),
            }),
        })
        .then(res => res.json())
        .then(data => setCobaltToken(data.token))
        .catch(console.error);
    };

    useEffect(() => {
        // generate cobalt token and store it
        generateCobaltToken();

        // get all workflow templates from Cobalt using the backend SDK
        fetch("/api/templates")
        .then(res => res.json())
        .then(setTemplates)
        .catch(console.error);
    }, []);

    return (
        // pass the generated cobalt token to the Cobalt Provider and
        // wrap the Cobalt Provider component around the Cobalt Installer component
        <CobaltProvider sessionToken={ cobaltToken }>
            <div className="Page">
                <div className="Header">Workflows</div>
                <div className="Workflows">
                    {
                        // render the workflow templates you get from
                        templates.map(wf =>
                            <div className="">
                                <div>{ wf.name }</div>
                                <div>{ wf.description }</div>
                                <button onClick={ () => setSelectedTemplate(wf._id) }>Install</button>
                            </div>
                        )
                    }
                </div>

                { /*
                   * render the workflow template installer in a modal, inline or however you want
                   * by passing the workflow template id to the installer
                   */ }
                <dialog open={ !!selectedTemplate }>
                    <CobaltInstaller
                        templateId={ selectedTemplate }
                        onInstall={ () => setSelectedTemplate(null) }
                    />
                </dialog>
            </div>
        </CobaltProvider>
    );
};

export default App
