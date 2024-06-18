import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { styled, keyframes, css } from "styled-components";
import { blackA, gray } from "@radix-ui/colors";
import Button from "./Button";

const DialogComponent = ({
    trigger,
    header,
    children,
    onSave,
}) => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            { trigger }
        </Dialog.Trigger>
        <Dialog.Portal>
        <DialogOverlay />
        <DialogContentContainer>
            {
                header && (
                    <DialogHeader>
                        { header }
                    </DialogHeader>
                )
            }
            <DialogContent>
                { children }
            </DialogContent>
            <DialogActions>
                <DialogBranding href="https://gocobalt.io" target="_blank">Powered by Cobalt</DialogBranding>
                <DialogActionButtons>
                    <Dialog.Close asChild>
                        <Button>Cancel</Button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                        <Button color="primary" onClick={ onSave }>Save</Button>
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
