import React from "react";
import styled from "styled-components";

const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
});

const Loader = () => (
    <Container>
        <img
            src="https://i.imgur.com/nEm368w.gif"
            width={ 50 }
            height={ 50 }
        />
    </Container>
);

export default Loader;
