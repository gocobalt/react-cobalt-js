import React, { useContext } from "react";

import { Context } from "../Provider";

const Header = () => {
    const { step, setStep, STEPS } = useContext(Context);

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
                            onClick={ () => setStep(t) }
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
