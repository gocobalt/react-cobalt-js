import React from "react";
import { Input, Option, Select, Stack, Textarea, Typography } from "@mui/joy";

const DataSlot = ({
    type,
    placeholder,
    options,
    labels,
    value,
    onChange,
}) => {
    if (type === "map") {
        return (
            <Stack spacing={ 1 }>
                {
                    labels?.map(label =>
                        <Stack key={ label.value } direction="row" alignItems="center" spacing={ 1 }>
                            <Typography flex={ 1 }>{ label.name }</Typography>
                            <Select
                                name={ label.value }
                                placeholder="Select"
                                value={ typeof value?.[label.value] !== "undefined" ? value?.[label.value] : "" }
                                onChange={ (_, v) => onChange({ ...value, [label.value]: v }) }
                                sx={{ flex: 1 }}
                            >
                                {
                                    options?.map(option =>
                                        <Option key={ option.value } value={ option.value }>{ option.name }</Option>
                                    )
                                }
                            </Select>
                        </Stack>
                    )
                }
            </Stack>
        );
    }

    if (type === "select") {
        return (
            <Select
                placeholder={ placeholder || "Select" }
                value={ value || "" }
                onChange={ (_, value) => onChange(value) }
            >
                {
                    options?.map(option =>
                        <Option key={ option.value } value={ option.value }>{ option.name }</Option>
                    )
                }
            </Select>
        );
    }

    if (type === "textarea") {
        return (
            <Textarea
                minRows={ 3 }
                placeholder={ placeholder || "Type something..." }
                value={ value || "" }
                onChange={ e => onChange(e.target.value) }
            />
        );
    }

    return (
        <Input
            type={ type }
            placeholder={ placeholder || "Type something..." }
            value={ value || "" }
            onChange={ e => onChange(e.target.value) }
        />
    );
};

export default DataSlot;
