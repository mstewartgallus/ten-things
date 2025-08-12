"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useId } from 'react';

interface Context {
    controlId?: string;
    infoId?: string;
}

const FreshContext = createContext<Context>({ });

export const useFresh = () => {
    return useContext(FreshContext);
};

interface Props {
    children: ReactNode;
}

export const FreshProvider = ({ children }: Props) => {
    const controlId = useId();
    const infoId = useId();
    const context = useMemo(() => ({ controlId, infoId }), [controlId, infoId]);
    return <FreshContext value={context}>{children}</FreshContext>;
}
