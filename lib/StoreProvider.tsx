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
    const persistAction = useContext(PersistContext);
    // FIXME use react "use" to wait for persistence to finish?
    useEffect(() => {
        persistAction();
    }, [persistAction]);
};

const withResolvers = <T,>() => {
    let resolve;
    let reject;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
};

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const ref = useRef<Store>(null);
    const persistRef = useRef<Persistor>(null);
    const onLoadRef = useRef<Promise<void>>(null);

    if (!ref.current) {
        const store = makeStore();

        const { promise, resolve } = withResolvers<void>();
        const persistor = persistStore(
            store,
            { manualPersist: true } as PersistorOptions,
            () => resolve());

        persistRef.current = persistor;
        ref.current = store;
        onLoadRef.current = promise;
    }

    const [persisting, setPersisting] = useState(false);

    useEffect(() => setupListeners(ref.current!.dispatch), []);
    useEffect(() => {
        if (persisting) {
            persistRef.current!.persist();
        } else {
            // FIXME not needed?
            persistRef.current!.pause();
        }
    }, [persisting]);

    const persistAction = useCallback(async () => {
        setPersisting(true);
        await onLoadRef.current!;
    }, []);

    return <Provider store={ref.current!}>
        <PersistContext.Provider value={persistAction}>
            {children}
        </PersistContext.Provider>
    </Provider>;
};
