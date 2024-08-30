import React from "react";

import DataSlot from "./DataSlot";
import Label from "../ui/Label";

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
 * @param {Function} props.onLHSChange Field Type
 */
const Field = ({
    type,
    name,
    description,
    placeholder,
    options,
    labels,
    required,
    multiple,
    value,
    onChange,
    // rule props
    ruleColumns,
    onLHSChange,
}) => (
    <Label
        title={ name }
        description={ description }
        required={ required }
    >
        <DataSlot
            type={ type }
            placeholder={ placeholder }
            multiple={ multiple }
            options={ options }
            labels={ labels }
            value={ value }
            onChange={ onChange }
            ruleColumns={ ruleColumns }
            onLHSChange={ onLHSChange }
        />
    </Label>
);

export default Field;
