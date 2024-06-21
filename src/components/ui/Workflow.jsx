import React from "react";
import styled from "styled-components";
import { gray } from "@radix-ui/colors";

import SwitchComponent from "./Switch";

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

const Flex = styled.div({
    flex: 1,
});

const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    border: "1px solid",
    borderColor: gray.gray5,
    borderRadius: 4,
});

const Header = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 12,
    borderBottom: props.enabled && "1px solid",
    borderColor: gray.gray5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: props.enabled && gray.gray1,
}));

const Content = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 12,
});

const Workflow = React.forwardRef(({
    title,
    description,
    enabled,
    onEnabledChange,
    children,
    ...props
}, ref) => (
    <Container ref={ ref } { ...props }>
        <Header enabled={ enabled }>
            <Flex>
                <Title>
                    { title }
                </Title>
                {
                    description && (
                        <Description>
                            { description }
                        </Description>
                    )
                }
            </Flex>
            <SwitchComponent
                checked={ enabled }
                onCheckedChange={ onEnabledChange }
            />
        </Header>
        {
            enabled && (
                <Content>
                    { children }
                </Content>
            )
        }
    </Container>
));

export default Workflow;
