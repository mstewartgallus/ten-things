'use client';

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import styles from "./MainLabel.module.css";

const MainContext = createContext<string | null>(null);

const { Provider } = MainContext;
export const MainContextProvider = ({ children, value }: { children: ReactNode, value: string }) =>
    <Provider value={value}>
        {children}
    </Provider>;

interface Props {
    readonly children: ReactNode;
}

export const useMainLabelId = () => useContext(MainContext);;
