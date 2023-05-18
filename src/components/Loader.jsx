import React from "react";
import { Stack } from "@mui/joy";

const Loader = () => (
    <Stack flexDirection="column" alignItems="center" justifyContent="center" p={ 3 }>
        <img
            src="https://i.imgur.com/nEm368w.gif"
            width={ 50 }
            height={ 50 }
        />
    </Stack>
);

export default Loader;
