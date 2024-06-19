import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { styled, keyframes, css } from "styled-components";
import { blackA, gray } from "@radix-ui/colors";
import Button from "./Button";

const DialogComponent = ({
    trigger,
    title,
    description,
    icon,
    children,
    action = "Save",
    onAction,
}) => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            { trigger }
        </Dialog.Trigger>
        <Dialog.Portal>
        <DialogOverlay />
        <DialogContentContainer>
            {
                title && (
                    <DialogHeader>
                        {
                            icon && <DialogIcon src={ icon } />
                        }
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <DialogTitle>{ title }</DialogTitle>
                            <DialogDescription>{ description }</DialogDescription>
                        </div>
                    </DialogHeader>
                )
            }
            {
                children && (
                    <DialogContent>
                        { children }
                    </DialogContent>
                )
            }
            <DialogActions>
                <DialogBranding href="https://gocobalt.io" target="_blank">Powered by Cobalt</DialogBranding>
                <DialogActionButtons>
                    <Dialog.Close asChild>
                        <Button>Cancel</Button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                        <Button color="primary" onClick={ onAction }>{ action }</Button>
                    </Dialog.Close>
                </DialogActionButtons>
            </DialogActions>
        </DialogContentContainer>
        </Dialog.Portal>
    </Dialog.Root>
);

const overlayShow = keyframes({
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
});

const contentShow = keyframes({
    "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
    "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const DialogOverlay = styled(Dialog.Overlay)({
    backgroundColor: blackA.blackA6,
    position: "fixed",
    inset: 0,
    animation: css`${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogHeader = styled.div({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottom: "1px solid",
    borderColor: gray.gray4,
    backgroundColor: gray.gray2,
    padding: 16,
});

const DialogIcon = styled.img({
    width: 55,
    height: 55,
    borderRadius: 8,
});

const DialogTitle = styled(Dialog.DialogTitle)({
    margin: 0,
    color: gray.gray12,
    fontSize: 20,
});

const DialogDescription = styled(Dialog.DialogDescription)({
    margin: 0,
    marginTop: 4,
    color: gray.gray11,
    fontSize: 16,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

const DialogContentContainer = styled(Dialog.Content)({
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 8,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    maxWidth: "450px",
    maxHeight: "85vh",
    animation: css`${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 16,
    overflowY: "auto",
});

const DialogActions = styled.div({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTop: "1px solid",
    borderColor: gray.gray4,
    backgroundColor: gray.gray2,
    padding: 16,
});

const DialogActionButtons = styled.div({
    display: "flex",
    flexDirection: "row",
    gap: 8,
});

const DialogBranding = styled.a({
    fontSize: 12,
    textDecoration: "none",
    color: gray.gray10,

    "&:hover": {
        color: "inherit",
    },
});

export default DialogComponent;
