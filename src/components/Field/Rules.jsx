import React from "react";
import { gray } from "@radix-ui/colors";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SelectItem from "../ui/SelectItem";
import styled from "styled-components";
import { Cross1Icon } from "@radix-ui/react-icons";

const Rules = ({
    level = 0,
    logic,
    conditions,
    onChange,
    ruleColumns,
    onLHSChange,
    options,
}) => {
    const addCondition = () => {
        onChange("conditions", conditions?.length ? conditions.concat({}) : [ {} ]);
    };

    const addConditions = (i, newLogic) => {
        const newConditions = [ ...conditions ];
        newConditions[i] = {
            logic: newLogic,
            conditions: [ newConditions[i], {} ],
        };
        onChange("conditions", newConditions);
    };

    const deleteCondition = (i) => {
        const newConditions = [ ...conditions ];
        newConditions.splice(i, 1);
        onChange("conditions", newConditions);
    };

    const updateCondition = (i, updatedCondition) => {
        const newConditions = [ ...conditions ];
        newConditions[i] = updatedCondition;
        onChange("conditions", newConditions);
    };

    const updateConditionField = (i, field, value, type) => {
        const newConditions = [ ...conditions ];
        newConditions[i] = { ...newConditions[i], [field]: value };
        if (type) {
            newConditions[i].type = type;
        }
        onChange("conditions", newConditions);
    };

    return (
        <Stack gap={ 8 }>
            {
                level === 0 && (
                    <Stack style={{ marginBottom: 8 }}>
                        <Select
                            placeholder="Select Operator"
                            value={ logic }
                            onValueChange={ v => onChange("logic", v) }
                        >
                            <SelectItem value="AND">Match All Rules</SelectItem>
                            <SelectItem value="OR">Match Any Rules</SelectItem>
                        </Select>
                    </Stack>
                )
            }

            {
                conditions?.map((cond, i) =>
                    <Stack key={ i } gap={ 8 }>
                        {
                            i > 0 && (
                                <Title color="secondary" textAlign="center">{ logic }</Title>
                            )
                        }
                        <Paper variant={ level === 0 && "outlined" }>
                            <Stack gap={ 6 } padding={ level === 0 ? 12 : 0 }>
                                {
                                    level === 0 && (
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center" gap={ 8 }>
                                                <Title>Rule { i + 1 }</Title>
                                                <Button size="small" onClick={ () => deleteCondition(i) }><Cross1Icon /></Button>
                                            </Stack>
                                            {
                                                !!cond.conditions?.length
                                                ?   <Stack direction="row" gap={ 4 }>
                                                        {
                                                            [ "AND", "OR" ].map(l =>
                                                                <Button
                                                                    key={ l }
                                                                    size="small"
                                                                    color={ cond.logic === l ? "secondary" : "text" }
                                                                    onClick={ () => updateConditionField(i, "logic", l) }
                                                                >
                                                                    { l }
                                                                </Button>
                                                            )
                                                        }
                                                    </Stack>
                                                :   <Stack direction="row" gap={ 4 }>
                                                        {
                                                            [ "AND", "OR" ].map(l =>
                                                                <Button size="small" onClick={ () => addConditions(i, l) }>+ { l }</Button>
                                                            )
                                                        }
                                                    </Stack>
                                            }
                                        </Stack>
                                    )
                                }
                                <div>
                                    {
                                        cond.logic
                                        ?   <Rules
                                                level={ level + 1 }
                                                logic={ cond.logic }
                                                conditions={ cond.conditions }
                                                onChange={ (k, v) => updateCondition(i, { ...cond, [k]: v }) }
                                                ruleColumns={ ruleColumns }
                                                onLHSChange={ onLHSChange }
                                                options={ options }
                                            />
                                        :   <Stack gap={ 8 }>
                                                <Select
                                                    placeholder="Field"
                                                    value={ cond.lhs }
                                                    onValueChange={ v => {
                                                        updateConditionField(i, "lhs", v);
                                                        onLHSChange && onLHSChange(v);
                                                    }}
                                                >
                                                    {
                                                        options?.map(o =>
                                                            <SelectItem value={ o.value }>{ o.name }</SelectItem>
                                                        )
                                                    }
                                                </Select>
                                                <Select
                                                    placeholder="Operator"
                                                    value={ cond.operator }
                                                    onValueChange={ v => updateConditionField(i, "operator", v) }
                                                >
                                                    {
                                                        ruleColumns?.operator?.options?.map(o =>
                                                            <SelectItem value={ o.value }>{ o.name }</SelectItem>
                                                        )
                                                    }
                                                </Select>
                                                {
                                                    (ruleColumns?.rhs?.type || cond.type) === "select"
                                                    ?   <Select
                                                            placeholder="Value"
                                                            value={ cond.rhs }
                                                            onValueChange={ v => {
                                                                updateConditionField(i, "rhs", v, ruleColumns?.rhs?.type || cond.type || "select");
                                                            }}
                                                        >
                                                            {
                                                                ruleColumns?.rhs?.options?.map(o =>
                                                                    <SelectItem value={ o.value }>{ o.name }</SelectItem>
                                                                )
                                                            }
                                                        </Select>
                                                    :   <Input
                                                            type={ ruleColumns?.rhs?.type || cond.type || "text" }
                                                            placeholder="Value"
                                                            value={ cond.rhs }
                                                            onChange={ e => updateConditionField(i, "rhs", e.target.value, ruleColumns?.rhs?.type || cond.type) }
                                                            style={{ flex: 1 }}
                                                        />
                                                }
                                            </Stack>
                                    }
                                </div>
                            </Stack>
                        </Paper>
                    </Stack>
                )
            }

            <Stack style={{ marginTop: 8 }}>
                <Button onClick={ addCondition }>+ Add Rule</Button>
            </Stack>
        </Stack>
    );
};

const Stack = styled.div(props => ({
    display: "flex",
    flexDirection: props.direction || "column",
    alignItems: props.alignItems,
    justifyContent: props.justifyContent,
    gap: props.gap,
    padding: props.padding,
}));

const Paper = styled.div(props => ({
    boxShadow: props.variant === "outlined" ? `0 0 0 1px ${gray.gray5}` : "none",
    borderRadius: 4,
}));

const Title = styled.div(props => ({
    fontSize: 14,
    fontWeight: 500,
    color: props.color === "secondary" ? gray.gray11 : gray.gray12,
    textAlign: props.textAlign,
}));

export default Rules;
