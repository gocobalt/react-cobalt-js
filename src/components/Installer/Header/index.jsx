import React, { useContext } from "react";

import { Context } from "../Provider";

const Header = () => {
    const { step, setStep, STEPS, workflow, selectedItem, setSelectedItem } = useContext(Context);

    const selectStep = (step) => {
        setStep(step);
        setSelectedItem(null);
    };

    return (
        <div style={{
            display: selectedItem ? "none" : "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: 30,
        }}>
            <div style={{
                width: "100%",
                paddingBottom: 30,
                borderBottom: "1px solid #dfe3e8",
            }}>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                    { workflow?.name }
                </div>
                <div style={{ fontSize: 14, color: "#919eab" }}>
                    { workflow?.description }
                </div>
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
                padding: "8px 15px",
                borderRadius: 8,
                backgroundColor: "#f9fafb",
            }}>
            {
                STEPS.map((s, i) =>
                    <div
                        key={ i }
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <span
                            onClick={ () => selectStep(i) }
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: step === i ? "#212b36" : "#919eab",
                                cursor: "pointer",
                            }}
                        >
                            { s.name }
                        </span>
                        {
                            i !== STEPS.length - 1 && (
                                <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 25,
                                    height: 25,
                                    margin: "0 5px",
                                    color: "#637381",
                                    fontSize: 16,
                                }}>&#10095;</span>
                            )
                        }
                    </div>
                )
            }
            </div>
        </div>
    );
};

export default Header;
