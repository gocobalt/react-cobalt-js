import React from "react";
import styled from "styled-components";
import { gray } from "@radix-ui/colors";

const Title = styled.div({
    fontSize: 16,
    fontWeight: 500,
    color: gray.gray12,
});

const Description = styled.div({
    marginTop: 4,
    fontSize: 14,
    lineHeight: 1,
    color: gray.gray10,
});

const Stack = styled.label({
    display: "flex",
    flexDirection: "column",
    gap: 8,
});

const Label = React.forwardRef(({
    title,
    description,
    children,
    ...props
}, ref) => (
    <Stack ref={ ref } { ...props }>
        <div>
            <Title>
                { title }
            </Title>
            <Description>
                { description }
            </Description>
        </div>
        { children }
    </Stack>
));

export default Label;
