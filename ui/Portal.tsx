import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
    readonly children: ReactNode;
    readonly domNode?: Node;
}

export const Portal = ({ children, domNode }: PortalProps) => {
    if (!domNode) {
        return;
    }
    return createPortal(children, domNode);
}
