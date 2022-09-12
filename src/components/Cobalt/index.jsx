import React, { useContext } from "react";

import { Context, Provider } from "../Provider";

const Cobalt = () => {
    const context = useContext(Context);

    return (
        <Provider>
            { context.token }
        </Provider>
    );
}

export default Cobalt;
