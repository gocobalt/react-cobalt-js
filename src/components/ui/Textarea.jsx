import styled from "styled-components";
import { gray } from "@radix-ui/colors";

const Textarea = styled.textarea({
    resize: "vertical",
    minHeight: 50,
    padding: 10,
    border: "none",
    borderRadius: 4,
    fontFamily: "inherit",
    fontSize: 15,
    lineHeight: 1,
    color: gray.gray11,
    outline: "none",
    boxShadow: `0 0 0 1px ${gray.gray5}`,

    "&:hover": {
        boxShadow: `0 0 0 1px ${gray.gray7}`,
    },

    "&:focus": {
        boxShadow: `0 0 0 2px ${gray.gray12}`,
    },
});

export default Textarea;
