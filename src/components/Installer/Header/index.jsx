import React, { useContext } from "react";

import { Context } from "../Provider";

const Header = () => {
    const { step, setStep, STEPS, workflow, selectedItem, setSelectedItem } = useContext(Context);

    const selectStep = (step) => {
        setStep(step);

        if (step === STEPS.CONNECT && workflow?.applications?.length === 1) setSelectedItem(workflow?.applications[0].app_type);
        else if (step === STEPS.CONFIGURE && workflow?.configure?.length === 1) setSelectedItem(workflow?.configure[0].node_id);
        else setSelectedItem(null);
    };

    return (
        <div style={{
            display: selectedItem ? "none" : "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        }}>
            <div style={{
                width: "100%",
                padding: 20,
                borderBottom: "1px solid lightgray",
            }}>
                <div style={{ fontSize: 18, fontWeight: "bold" }}>
                    { workflow?.name }
                </div>
                <div style={{ fontSize: 14, color: "gray" }}>
                    { workflow?.description }
                </div>
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px 15px 0px",
                padding: 10,
                borderRadius: 8,
                backgroundColor: "rgba(0, 0, 0, .04)",
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
                                fontSize: 16,
                                fontWeight: "bold",
                                opacity: step === t ? 1 : .5,
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
                                    color: "gray",
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
