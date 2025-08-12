"use client";

import type { ReactNode } from "react";
import type { Cursor } from "./Html";
import { createContext, useEffect, useContext } from "react";

interface Context {
    onCursorChange: (cursor?: Cursor) => void;
}

const UiContext = createContext<Context>({
    onCursorChange: () => {},
});
UiContext.displayName = 'UiContext';

type Props = Context & {
    children: ReactNode;
}

export const UiProvider = ({ children, ...props }: Props) =>
    <UiContext value={props}>{children}</UiContext>;

export const useCursor = (cursor?: Cursor) => {
    const { onCursorChange } = useContext(UiContext);
    useEffect(() => {
        onCursorChange(cursor);
        return () => onCursorChange();
    }, [onCursorChange, cursor]);
};
