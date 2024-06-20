import React from "react";
import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";

const TabsContent = styled(Tabs.Content)({
    flexGrow: 1,
    outline: "none",
    overflowY: "auto",
});

const TabsContentContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 16,
});

const Tab = React.forwardRef(({ children, ...props }, forwardedRef) => (
    <TabsContent { ...props } ref={ forwardedRef }>
        <TabsContentContainer>
            { children }
        </TabsContentContainer>
    </TabsContent>
));
Tab.displayName = "Tab";

export default Tab;
