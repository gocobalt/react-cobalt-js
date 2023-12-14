import React from "react";
import { Input, Option, Select, Stack, Textarea, Typography } from "@mui/joy";

const handleSelectValue = (value, isMultiple) => {
    if (isMultiple) {
        if (value instanceof Array) return value;
        return [];
    }
    if (typeof value !== "undefined" && typeof value !== "object") return value;
    return "";
};

const DataSlot = ({
    type,
    placeholder,
    multiple,
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
                            <Typography flex={ 1 } sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{ label.name }</Typography>
                            <Select
                                name={ label.value }
                                placeholder="Select"
                                multiple={ label.multiple }
                                value={ handleSelectValue(value?.[label.value], label.multiple) }
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
                multiple={ multiple }
                value={ handleSelectValue(value, multiple) }
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
