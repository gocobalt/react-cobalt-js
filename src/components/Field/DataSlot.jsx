import React from "react";

import Rules from "./Rules";
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
    // rule props
    ruleColumns,
    onLHSChange,
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

    if (type === "rule_engine") {
        return (
            <Rules
                logic={ value?.logic }
                conditions={ value?.conditions }
                onChange={ (k, v) => onChange({ ...value, [k]: v }) }
                options={ options }
                ruleColumns={ ruleColumns }
                onLHSChange={ onLHSChange }
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
