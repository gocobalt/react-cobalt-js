import React from "react";
import styled from "styled-components";
import * as Switch from "@radix-ui/react-switch";
import { gray } from "@radix-ui/colors";

const SwitchRoot = styled(Switch.Root)({
    all: "unset",
    width: 42,
    height: 25,
    backgroundColor: gray.gray7,
    borderRadius: "9999px",
    position: "relative",
    "&:hover, &:focus": {
        backgroundColor: gray.gray8,
    },
    "&[data-state=\"checked\"]": {
        backgroundColor: gray.gray12,
    },
});

const SwitchThumb = styled(Switch.Thumb)({
    display: "block",
    width: 21,
    height: 21,
    backgroundColor: gray.gray1,
    borderRadius: "9999px",
    transition: "transform 100ms",
    transform: "translateX(2px)",
    willChange: "transform",
    "&[data-state=\"checked\"]": { transform: "translateX(19px)" },
});

const SwitchComponent = React.forwardRef(({
    title,
    description,
    children,
    ...props
}, ref) => (
    <SwitchRoot { ...props } ref={ ref }>
        <SwitchThumb />
    </SwitchRoot>
));

export default SwitchComponent;
