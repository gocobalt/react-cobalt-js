import React from "react";
import styled from "styled-components";
import * as Select from "@radix-ui/react-select";
import { gray } from "@radix-ui/colors";

const SelectItem = React.forwardRef(({ children, ...props }, forwardedRef) => (
    <StyledItem { ...props } ref={ forwardedRef }>
        <Select.ItemText>{ children }</Select.ItemText>
    </StyledItem>
));

const StyledItem = styled(Select.Item)({
    height: 30,
    position: "relative",
    display: "flex",
    alignItems: "center",
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 4,
    fontSize: 15,
    lineHeight: 1,
    color: gray.gray11,
    userSelect: "none",

    "&[data-state=checked]": {
        fontWeight: 500,
        backgroundColor: gray.gray2,
    },

    "&[data-disabled]": {
        color: gray.gray8,
        pointerEvents: "none",
    },

    "&[data-highlighted]": {
        outline: "none",
        backgroundColor: gray.gray3,
    },
});

export default SelectItem;
