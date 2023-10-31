import { useEffect, useState } from "react";
// import the Cobalt Provider & Config components
import {
    Provider as CobaltProvider,
    Config as CobaltConfig,
} from "@cobaltio/react-cobalt-js";

const App = () => {
    const [ sessionToken, setSessionToken ] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI2M2IzY2E1NzczYTIxMjQzMTZkMDRiNTgiLCJsaW5rZWRfYWNjb3VudF9pZCI6InRlc3QiLCJlbnZpcm9ubWVudCI6InRlc3QiLCJpYXQiOjE2OTY1OTMyOTMsImV4cCI6MTY5Njg1MjQ5M30.kQ0uU23xr_yqY_KwAt7Dd0gsVWn8cLJOvm3ZLjvgFOs");
    const [ selectedApp, setSelectedApp ] = useState(null);

    // get Cobalt session token from Cobalt backend SDK
    const fetchSessionToken = () => {
        fetch("/api/token")
        .then(data => setSessionToken(data.token))
        .catch(console.error);
    };

    useEffect(() => {
        // get Cobalt session token and store it
        // fetchSessionToken();
    }, []);

    return (
        // pass the cobalt session token to the Cobalt `Provider` and
        // wrap the Cobalt `Provider` component around the Cobalt `Config` component
        <CobaltProvider baseApi="https://embedapi.gocobalt.io" sessionToken={ sessionToken }>
            <div className="Page">
                <div className="Header">Token: <code>{ sessionToken }</code></div>
                <div className="Header">Applications</div>
                <div className="Templates">
                    {/* you fetch all the enabled apps from Cobalt backend SDK and render them dynamically. */}
                    <div>
                        <div>Slack</div>
                        <button onClick={ () => setSelectedApp("slug") }>
                            Configure
                        </button>
                    </div>
                    <div>
                        <div>Twilio</div>
                        <button onClick={ () => setSelectedApp("twilio") }>
                            Configure
                        </button>
                    </div>
                </div>

                { /*
                   * render the `Config` component in a modal, inline or however you want
                   * by passing the app's `slug` (or `type`, if it's a native app) to the component.
                   */ }
                <dialog open={ !!selectedApp }>
                    <CobaltConfig
                        id="CONFIG_ID" // Optional.
                        slug={ selectedApp }
                        // dynamic fields payload (optional, only required when you're using dynamic labels)
                        fields={{ /* PAYLOAD */ }}
                        style={{
                            borderRadius: 8,
                            maxWidth: 450,
                        }}
                    />
                </dialog>
            </div>
        </CobaltProvider>
    );
};

export default App
