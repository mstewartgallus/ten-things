"use client";

import type { JSX } from "react";
import { createContext, useContext, useId } from "react";

const MainContext = createContext<string | null>(null);

export const useMainId = () => useContext(MainContext);

type Props = JSX.IntrinsicElements['main'];

export const Main = ({ children, ...props }: Props) => {
    const id = useId();
    return <main aria-labelledby={id} {...props}>
        <MainContext.Provider value={id}>
           {children}
        </MainContext.Provider>
        </main>;
};
