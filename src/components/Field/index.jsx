import React from "react";
import { Stack, Typography } from "@mui/joy";

import DataSlot from "./DataSlot";

/**
 * @param {Object} props
 * @param {String} props.type Field Type
 * @param {String} props.name Label
 * @param {String} props.description Description
 * @param {String} props.placeholder Placeholder
 * @param {Object[]} props.options Options
 * @param {String} props.options[].name Option Name
 * @param {String|Number} props.options[].value Option ID
 * @param {Object[]} props.labels Labels
 * @param {String} props.labels[].name Label Name
 * @param {String} props.labels[].value Label ID
 * @param {Boolean} props.required Is the field mandatory?
 * @param {String} props.value Value
 * @param {Function} props.onChange Field Type
 */
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
