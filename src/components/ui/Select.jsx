import React from "react";
import styled from "styled-components";
import * as Select from "@radix-ui/react-select";
import { blackA, gray } from "@radix-ui/colors";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

const SelectComponent = ({
    placeholder,
    children,
    ...props
}) => (
    <Select.Root { ...props }>
        <SelectTrigger>
            <Select.Value placeholder={ placeholder || "Select" } />
            <Select.Icon>
                <ChevronDownIcon color={ gray.gray10 } />
            </Select.Icon>
        </SelectTrigger>
        <Select.Portal>
            <SelectContent>
                <SelectScrollUpButton>
                    <ChevronUpIcon />
                </SelectScrollUpButton>
                <SelectViewport>
                    { children }
                </SelectViewport>
                <SelectScrollDownButton>
                    <ChevronDownIcon />
                </SelectScrollDownButton>
            </SelectContent>
        </Select.Portal>
    </Select.Root>
);

const SelectTrigger = styled(Select.SelectTrigger)({
    all: "unset",

    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    height: 35,
    minHeight: 35,
    padding: "0 10px",
    borderRadius: 4,
    fontSize: 15,
    lineHeight: 1,
    color: gray.gray11,
    boxShadow: `0 0 0 1px ${gray.gray5}`,
    cursor: "pointer",

    "&:hover": {
        boxShadow: `0 0 0 1px ${gray.gray7}`,
    },

    "&:focus": {
        boxShadow: `0 0 0 2px ${gray.gray12}`,
    },
});

const SelectContent = styled(Select.Content)({
    overflow: "hidden",
    backgroundColor: gray.gray1,
    borderRadius: 8,
    // boxShadow: "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
    boxShadow: `0 0 0 1px ${gray.gray5}, 0px 4px 12px -8px ${blackA.blackA5}`,
});

const SelectViewport = styled(Select.Viewport)({
    padding: 8,
});

const scrollButtonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    backgroundColor: "white",
    color: gray.gray11,
    cursor: "default",
};
const SelectScrollUpButton = styled(Select.ScrollUpButton)(scrollButtonStyles);
const SelectScrollDownButton = styled(Select.ScrollDownButton)(scrollButtonStyles);


export default SelectComponent;
