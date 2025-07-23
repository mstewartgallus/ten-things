"use client";

import type { ReactNode } from "react";
import type { Persistor, PersistorOptions } from "redux-persist";
import type { Store } from "@reduxjs/toolkit";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
    createContext, use, useEffect, useRef,
    useState,
    useTransition
} from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

const PersistorContext = createContext<Persistor | null>(null);
PersistorContext.displayName = `PersistorContext`;
const PersistorProvider = PersistorContext.Provider;


const neverPromise = new Promise<void>(() => {});

const PersistOnLoadContext = createContext<Promise<void>>(neverPromise);
PersistOnLoadContext.displayName = `PersistOnLoadContext`;
const PersistOnLoadProvider = PersistOnLoadContext.Provider;


const PersistLoadedContext = createContext<boolean>(false);
PersistLoadedContext.displayName = `PersistLoadedContext`;
const PersistLoadedProvider = PersistLoadedContext.Provider;

export const usePersistIsLoaded = () => use(PersistLoadedContext);

export const usePersist = () => {
    const persistor = use(PersistorContext);
    useEffect(() => {
        if (!persistor) {
            return;
        }
        persistor.persist()
    }, [persistor]);
};

// FIXME need to think through this
export const usePersistLoaded = () => {
    const onLoad = use(PersistOnLoadContext);
    use(onLoad);
};

interface Props {
    readonly children: ReactNode;
}

interface RefState {
    store: Store;
    persistor: Persistor;
    persistorPromise: Promise<void>;
}

const withResolvers = <T,>() => {
    let resolve;
    let reject;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
};

const persistStoreAsync = (store: Store) => {
    const { promise, resolve } = withResolvers<void>();
    const persistor = persistStore(store, {
        manualPersist: true
    } as PersistorOptions, () => resolve());
    return { persistor, promise };
};

export const StoreProvider = ({ children }: Props) => {
    const ref = useRef<RefState>(null);
    const [loaded, setLoaded] = useState(false);
    const [, startTransition] = useTransition();

    useEffect(() => setupListeners(ref.current!.store.dispatch), []);
    useEffect(() => {
        (async () => {
            await ref.current!.persistorPromise;
            startTransition(() => setLoaded(true));
        })();
    }, []);

    if (!ref.current) {
        const store = makeStore();
        const { persistor, promise: persistorPromise } = persistStoreAsync(store);

        ref.current = {
            store,
            persistor,
            persistorPromise
        };
    }
    return <Provider store={ref.current!.store}>
            <PersistorProvider value={ref.current!.persistor}>
                <PersistOnLoadProvider value={ref.current!.persistorPromise}>
                    <PersistLoadedProvider value={loaded}>
                        {children}
                    </PersistLoadedProvider>
                </PersistOnLoadProvider>
            </PersistorProvider>
        </Provider>;
};
