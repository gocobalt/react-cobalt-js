import styled from "styled-components";
import { gray } from "@radix-ui/colors";

const Button = styled.button(props => ({
    all: "unset",

    height: props.size === "small" ? 24 : 35,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: props.size === "small" ? "0 8px" : "0 16px",
    borderRadius: 4,
    backgroundColor: props.color === "primary" ? gray.gray12 : props.color === "text" ? "transparent" : gray.gray4,
    fontSize: props.size === "small" ? 12 : 15,
    fontWeight: 500,
    lineHeight: 1,
    color: props.color === "primary" ? gray.gray1 : gray.gray11,
    cursor: "pointer",

    "&:hover": {
        backgroundColor: props.color === "primary" ? gray.gray11 : props.color === "text" ? gray.gray3 : gray.gray5,
    },

    "&:focus": {
        boxShadow: `0 0 0 2px ${gray.gray12}`,
    },

    "&:disabled": {
        backgroundColor: props.color === "primary" ? gray.gray8 : gray.gray1,
        color: props.color === "primary" ? gray.gray1 : gray.gray8,
        pointerEvents: "none",
    },
}));

export default Button;
