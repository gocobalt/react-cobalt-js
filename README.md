# react-cobalt-js

> Cobalt frontend SDK

[![NPM](https://img.shields.io/npm/v/@cobaltio/react-cobalt-js.svg)](https://www.npmjs.com/package/@cobaltio/react-cobalt-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @cobaltio/react-cobalt-js
```

## Usage

```jsx
import { Provider, Installer } from "@cobaltio/react-cobalt-js";
```

## Example

Check the [example code](/example/src/App.js) to see how to use it.

```jsx
import React, { useEffect, useState } from "react";
// import the Cobalt Provider & Installer components
import { Provider as CobaltProvider, Installer as CobaltInstaller } from "@cobaltio/react-cobalt-js";

const Component = () => {
    const [ cobaltToken, setCobaltToken ] = useState(null);
    const [ templates, setTemplates ] = useState([]);
    const [ workflows, setWorkflows ] = useState([]);
    const [ selectedTemplate, setSelectedTemplate ] = useState(null);
    const [ selectedWorkflow, setSelectedWorkflow ] = useState(null);

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

        // get all installed workflows from Cobalt using the backend SDK
        fetch("/api/workflows")
        .then(res => res.json())
        .then(setWorkflows)
        .catch(console.error);
    }, []);

    return (
        // pass the generated cobalt token to the Cobalt Provider and
        // wrap the Cobalt Provider component around the Cobalt Installer component
        <CobaltProvider sessionToken={ cobaltToken }>
            <div className="Page">
                <div className="Header">Templates</div>
                <div className="Templates">
                    {
                        // render the workflow templates you get from cobalt backend sdk
                        templates.map(t =>
                            <div className="">
                                <div>{ t.name }</div>
                                <div>{ t.description }</div>
                                <button onClick={ () => {
                                    setSelectedTemplate(t._id);
                                    setSelectedWorkflow(null);
                                }}>
                                    Install
                                </button>
                            </div>
                        )
                    }
                </div>

                <div className="Header">Workflows</div>
                <div className="Workflows">
                    {
                        // render the installed workflows you get from cobalt backend sdk
                        workflows.map(wf =>
                            <div className="">
                                <div>{ wf.name }</div>
                                <div>{ wf.description }</div>
                                <button onClick={ () => {
                                    setSelectedTemplate(null);
                                    setSelectedWorkflow(wf._id);
                                }}>
                                    Edit
                                </button>
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

                { /*
                   * render the workflow editor in a modal, inline or however you want
                   * by passing the workflow id to the component
                   */ }
                <dialog open={ !!selectedWorkflow }>
                    <CobaltInstaller
                        workflowId={ selectedWorkflow }
                        onClose={ () => setSelectedTemplate(null) }
                    />
                </dialog>
            </div>
        </CobaltProvider>
    );
};

export default Component;
```
