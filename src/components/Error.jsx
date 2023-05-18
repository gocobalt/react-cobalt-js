import React from "react";
import { Stack, Typography } from "@mui/joy";

const ErrorComponent = ({ title, message }) => (
    <Stack flexDirection="column" alignItems="center" justifyContent="center" p={ 3 }>
        <img
            src="https://img.icons8.com/color/96/000000/cancel--v1.png"
            width={ 70 }
            height={ 70 }
            style={{ marginBottom: 10 }}
        />
        <Typography fontWeight="lg" gutterBottom>{ title }</Typography>
        <Typography color="neutral">{ message }</Typography>
    </Stack>
);

export default ErrorComponent;
