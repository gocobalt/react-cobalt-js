import React from "react";

const ErrorComponent = ({ title, message }) => (
    <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 25,
    }}>
        <img
            src="https://img.icons8.com/color/96/000000/cancel--v1.png"
            width={ 70 }
            height={ 70 }
            style={{ marginBottom: 10 }}
        />
        <h4>{ title }</h4>
        <p>{ message }</p>
    </div>
);

export default ErrorComponent;
