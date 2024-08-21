import React from "react";

import Input from "../ui/Input";
import Select from "../ui/Select";
import SelectItem from "../ui/SelectItem";
import Textarea from "../ui/Textarea";
import Fieldset from "../ui/Fieldset";
import Combobox from "../ui/Combobox";

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
            labels?.map(label =>
                <Fieldset
                    key={ label.value }
                    title={ label.name }
                >
                    <Select
                        name={ label.value }
                        value={ value?.[label.value] }
                        onValueChange={ v => onChange({ ...value, [label.value]: v }) }
                    >
                        {
                            options?.map(option =>
                                <SelectItem key={ option.value } value={ option.value }>{ option.name }</SelectItem>
                            )
                        }
                    </Select>
                </Fieldset>
            )
        );
    }

    if (type === "select") {
        return (
            <Combobox
                placeholder={ placeholder }
                isMulti={ multiple }
                value={ value }
                onChange={ onChange }
                options={ options }
            />
        );
    }

    if (type === "textarea") {
        return (
            <Textarea
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
