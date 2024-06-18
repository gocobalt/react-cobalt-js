import styled from "styled-components";
import { gray } from "@radix-ui/colors";

const Input = styled.input({
    all: "unset",

    height: 35,
    minHeight: 35,
    padding: "0 10px",
    borderRadius: 4,
    fontSize: 15,
    lineHeight: 1,
    color: gray.gray11,
    boxShadow: `0 0 0 1px ${gray.gray5}`,
    cursor: "text",

    "&:hover": {
        boxShadow: `0 0 0 1px ${gray.gray7}`,
    },

    "&:focus": {
        boxShadow: `0 0 0 2px ${gray.gray12}`,
    },
});

export default Input;
