"use client";

import type { ReactNode } from "react";
import type { Persistor, PersistorOptions } from "redux-persist";
import type { Store } from "@reduxjs/toolkit";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

const PersistContext = createContext<() => Promise<void>>(() => {
    throw Error("no persistor");
});

export const usePersist = () => {
    const persist = useContext(PersistContext);
    // FIXME use react "use" to wait for persistence to finish?
    useEffect(() => {
        persist();
    }, []);
};

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const ref = useRef<Store>(null);
    const promiseRef = useRef<Promise<void>>(null);

    if (!ref.current) {
        ref.current = makeStore();
    }

    useEffect(() => setupListeners(ref.current!.dispatch), []);

    const persist = useCallback(async () => {
        const store = ref.current!;
        let persistPromise = promiseRef.current;

        if (!persistPromise) {
            persistPromise = new Promise<void>(res => persistStore(store, null, () => res()));
            promiseRef.current = persistPromise;
        }

        await persistPromise;
    }, []);

    return <Provider store={ref.current!}>
        <PersistContext.Provider value={persist}>
            {children}
        </PersistContext.Provider>
    </Provider>;
};
