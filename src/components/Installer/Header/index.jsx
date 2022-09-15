import React, { useContext } from "react";

import { Context } from "../Provider";

const Header = () => {
    const { step, setStep, STEPS, selectedItem, setSelectedItem } = useContext(Context);

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
                <div style={{ fontSize: 32, fontWeight: "bold" }}>
                    Manage integrations
                </div>
                <div style={{ fontSize: 14, color: "#919eab" }}>
                    Choose your integration &amp; proceed with authentication &amp; setup.
                </div>
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
                padding: 15,
                borderRadius: 8,
                backgroundColor: "#f9fafb",
            }}>
            {
                Object.values(STEPS).map((t, i) =>
                    <div
                        key={ t }
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <span
                            onClick={ () => selectStep(t) }
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: step === t ? "#212b36" : "#919eab",
                                cursor: "pointer",
                            }}
                        >
                            { t }
                        </span>
                        {
                            i !== Object.values(STEPS).length - 1 && (
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
