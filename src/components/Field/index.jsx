import React from "react";
import { Stack, Typography } from "@mui/joy";

import DataSlot from "./DataSlot";

const Field = ({
    type,
    name,
    description,
    placeholder,
    options,
    labels,
    required,
    value,
    onChange,
}) => (
    <Stack spacing={ 1 }>
        <Stack>
            <Stack direction="row" spacing={ 1 }>
                <Typography fontWeight="md">{ name }</Typography>
                <Typography color="neutral" fontSize="sm">{ !required && "(optional)" }</Typography>
            </Stack>
            <Typography color="neutral" fontSize="sm">{ description }</Typography>
        </Stack>
        <DataSlot
            type={ type }
            placeholder={ placeholder }
            options={ options }
            labels={ labels }
            value={ value }
            onChange={ onChange }
        />
    </Stack>
);

export default Field;
