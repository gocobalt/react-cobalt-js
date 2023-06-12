import { useEffect, useState } from "react";
// import the Cobalt Provider & Config components
import {
    Provider as CobaltProvider,
    Config as CobaltConfig,
} from "@cobaltio/react-cobalt-js";

const App = () => {
    const [ sessionToken, setSessionToken ] = useState(null);
    const [ selectedApp, setSelectedApp ] = useState(null);

    // get Cobalt session token from Cobalt backend SDK
    const fetchSessionToken = () => {
        fetch("/api/token")
        .then(data => setSessionToken(data.token))
        .catch(console.error);
    };

    useEffect(() => {
        // get Cobalt session token and store it
        fetchSessionToken();
    }, []);

    return (
        // pass the cobalt session token to the Cobalt `Provider` and
        // wrap the Cobalt `Provider` component around the Cobalt `Config` component
        <CobaltProvider sessionToken={ sessionToken }>
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
