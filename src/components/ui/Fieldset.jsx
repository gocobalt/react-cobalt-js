import React from "react";
import styled from "styled-components";
import { gray } from "@radix-ui/colors";

const Row = styled.label({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
});

const Title = styled.div({
    flex: 1,
    fontSize: 15,
    fontWeight: 500,
    color: gray.gray12,
});

const Content = styled.div({
    flex: 1,
    fontSize: 15,
    color: gray.gray10,
});

const Fieldset = React.forwardRef(({
    title,
    children,
    ...props
}, ref) => (
    <Row ref={ ref } { ...props }>
        <Title>
            { title }
        </Title>
        <Content>
            { children }
        </Content>
    </Row>
));

export default Fieldset;
