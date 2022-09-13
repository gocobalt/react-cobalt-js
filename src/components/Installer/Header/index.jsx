import React, { useContext } from "react";

import { Context } from "../Provider";

const Header = () => {
    const { step, setStep, STEPS, workflow, setSelectedItem } = useContext(Context);

    const selectStep = (step) => {
        setStep(step);

        if (step === STEPS.CONNECT && workflow?.applications?.length === 1) setSelectedItem(workflow?.applications[0].app_type);
        else if (step === STEPS.CONFIGURE && workflow?.configure?.length === 1) setSelectedItem(workflow?.configure[0].node_id);
        else setSelectedItem(null);
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 15,
            borderBottom: "1px solid lightgray",
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
                                    margin: "0 15px",
                                    borderRadius: "50%",
                                    backgroundColor: "lightgray",
                                    color: "gray",
                                    fontSize: 16,
                                }}>&#10095;</span>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};

export default Header;
