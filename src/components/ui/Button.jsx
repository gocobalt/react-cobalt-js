import styled from "styled-components";
import { gray } from "@radix-ui/colors";

const Button = styled.button(props => ({
    all: "unset",

    height: 35,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    borderRadius: 4,
    backgroundColor: props.color === "primary" ? gray.gray12 : gray.gray4,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 1,
    color: props.color === "primary" ? gray.gray1 : gray.gray11,
    cursor: "pointer",

    "&:hover": {
        backgroundColor: props.color === "primary" ? gray.gray11 : gray.gray5,
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
