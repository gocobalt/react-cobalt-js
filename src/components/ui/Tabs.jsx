import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";
import { gray } from "@radix-ui/colors";

export const TabsRoot = styled(Tabs.Root)({
    display: "flex",
    flexDirection: "column",
});

export const TabsList = styled(Tabs.List)({
    flexShrink: 0,
    display: "flex",
    borderBottom: `1px solid ${gray.gray4}`,
});

export const TabsTrigger = styled(Tabs.Trigger)({
    all: "unset",
    flex: 1,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    color: gray.gray10,
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: 1,
    cursor: "pointer",
    "&:hover": {
        color: gray.gray11,
    },
    "&[data-state=\"active\"]": {
        color: gray.gray12,
        fontWeight: 500,
        boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
    },
});
