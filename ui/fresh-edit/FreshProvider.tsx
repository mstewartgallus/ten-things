"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useId } from 'react';

const FreshContext = createContext<string | null>(null);

export const useFresh = () => {
    const controlId = useContext(FreshContext) ?? undefined;
    return { controlId };
};

interface Props {
    children: ReactNode;
}

export const FreshProvider = ({ children }: Props) => {
    const controlId = useId();
    return <FreshContext value={controlId}>{children}</FreshContext>;
}
