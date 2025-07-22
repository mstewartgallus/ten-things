"use client";

import type { AppStore } from "@/lib/store";
import type { ReactNode } from "react";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const storeRef = useRef<AppStore>(null);
    useEffect(() => setupListeners(storeRef.current!.dispatch), []);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current!}>
        {children}
        </Provider>;
};
