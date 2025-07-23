"use client";

import type { ReactNode } from "react";
import type { Persistor } from "redux-persist";
import type { Store } from "@reduxjs/toolkit";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useEffect, useRef } from "react";
import { Provider, useStore } from "react-redux";
import { persistStore } from "redux-persist";

let globalPersistor: Persistor | null = null;
export const usePersistIsLoaded = () => globalPersistor !== null;

export const usePersist = () => {
    const store = useStore();
    useEffect(() => {
        if (globalPersistor) {
            return;
        }

        globalPersistor = persistStore(store);
    }, [store]);
};

export const usePersistLoaded = () => {
};

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const ref = useRef<Store>(null);

    useEffect(() => setupListeners(ref.current!.dispatch), []);

    if (!ref.current) {
        ref.current = makeStore();

    }
    return <Provider store={ref.current!}>
        {children}
    </Provider>;
};
