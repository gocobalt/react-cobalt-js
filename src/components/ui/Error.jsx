import { gray } from "@radix-ui/colors";
import React from "react";
import styled from "styled-components";

const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
});

const Title = styled.div({
    fontSize: 18,
    fontWeight: 500,
    color: gray.gray12,
    textAlign: "center",
});

const Description = styled.div({
    marginTop: 4,
    fontSize: 16,
    color: gray.gray11,
    textAlign: "center",
});

const ErrorComponent = ({ title, message }) => (
    <Container>
        <img
            src="https://img.icons8.com/color/96/000000/cancel--v1.png"
            width={ 70 }
            height={ 70 }
            style={{ marginBottom: 10 }}
        />
        <Title>{ title }</Title>
        <Description>{ message }</Description>
    </Container>
);

export default ErrorComponent;
