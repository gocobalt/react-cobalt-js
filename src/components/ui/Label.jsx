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

const Tag = styled.span({
    fontSize: 12,
    lineHeight: 1,
    color: gray.gray10,
});

const Stack = styled.label(props => ({
    display: "flex",
    flexDirection: props.horizontal ? "row" : "column",
    justifyContent: props.horizontal ? "space-between" : "initial",
    alignItems: props.horizontal ? "center" : "initial",
    gap: 8,
}));

const Label = React.forwardRef(({
    title,
    description,
    required,
    children,
    ...props
}, ref) => (
    <Stack { ...props } ref={ ref }>
        <div>
            <Title>
                { title } <Tag>(optional)</Tag>
            </Title>
            <Description>
                { description }
            </Description>
        </div>
        { children }
    </Stack>
));

export default Label;
