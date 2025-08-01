import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
    readonly children: ReactNode;
    readonly domNode?: Element | DocumentFragment;
}

export const Portal = ({ children, domNode }: Props) => {
    if (!domNode) {
        return;
    }
    return createPortal(children, domNode);
}
