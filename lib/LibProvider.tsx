"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useContext } from "react";

interface Context {
    onPersist: () => void;
}

const LibContext = createContext<Context>({
    onPersist: () => {}
});
LibContext.displayName = 'LibContext';

type Props = Context & {
    children: ReactNode;
}

export const LibProvider = ({ children, ...props }: Props) =>
    <LibContext value={props}>{children}</LibContext>;

export const usePersist = () => {
    const { onPersist } = useContext(LibContext);
    useEffect(() => {
        onPersist();
    }, [onPersist]);
};
