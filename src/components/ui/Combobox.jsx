import React from "react";
import Select from "react-select";

const handleSelectValue = (value, isMultiple, options = []) => {
    if (isMultiple) {
        if (value instanceof Array) return options.filter(o => value.includes(o.value));
        return undefined;
    }
    if (typeof value !== "undefined" && typeof value !== "object") return options.find(o => o.value === value) || undefined;
    return undefined;
};

const handleSelectChange = (option, isMultiple) => {
    if (isMultiple) {
        if (option instanceof Array) return option.map(o => o.value);
        return [];
    }
    return typeof option?.value !== "undefined" ? option?.value : "";
};

/**
 * Custom Combobox component extending React Select.
 * @param {import("react-select").Props} props - The props for React Select.
 * @returns {JSX.Element} The rendered Combobox component.
 */
const Combobox = ({
    ...props
}) => {
    return (
        <Select
            isClearable
            { ...props }
            defaultValue={ handleSelectValue(props.defaultValue, props.isMulti, props.options) }
            value={ handleSelectValue(props.value, props.isMulti, props.options) }
            onChange={ v => props.onChange && props.onChange(handleSelectChange(v, props.isMulti)) }
            getOptionLabel={ o => o?.name || o?.value }
            options={ props.options || [] }
        />
    )
}

export default Combobox;
