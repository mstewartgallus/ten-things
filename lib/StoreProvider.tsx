"use client";

import type { ReactNode } from "react";
import type { Persistor, PersistorOptions } from "redux-persist";
import type { Store } from "@reduxjs/toolkit";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createContext, use, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

const neverPromise: Promise<void> = new Promise(() => {});

const PersistorContext = createContext<Promise<void>>(neverPromise);
PersistorContext.displayName = `PersistorContext`;

// Integrate persistence with hydration and Suspense
export const usePersisting = () => {
    const ps = use(PersistorContext);
    use(ps);
};

interface Props {
    readonly children: ReactNode;
}

interface RefState {
    store: Store;
    persistor: Persistor;
    persistorPromise: Promise<void>;
}

export const StoreProvider = ({ children }: Props) => {
    const ref = useRef<RefState>(null);
    useEffect(() => setupListeners(ref.current!.store.dispatch), []);
    useEffect(() => ref.current!.persistor.persist(), []);

    if (!ref.current) {
        const store = makeStore();
        const box: { persistor?: Persistor } = { };
        const persistorPromise = new Promise<void>(resolve => {
            const config = { manualPersist: true } as PersistorOptions;
            box.persistor = persistStore(store, config, () => resolve());
        });
        const persistor = box.persistor!;
        ref.current = { store, persistor, persistorPromise };
    }

    return <Provider store={ref.current.store!}>
        <PersistorContext.Provider value={ref.current.persistorPromise}>
                {children}
        </PersistorContext.Provider>
        </Provider>;
};
