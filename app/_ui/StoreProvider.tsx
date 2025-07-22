"use client";

import type { AppStore } from "@/lib/store";
import type { ReactNode } from "react";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

const BootstrappedContext = createContext<boolean>(false);

export const usePersistBootstrapped = () => useContext(BootstrappedContext);

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const storeRef = useRef<AppStore>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }
    const store: AppStore = storeRef.current;

    const [bootstrapped, setBootstrapped] = useState(false);

    useEffect(() => setupListeners(store.dispatch), [store]);

    useEffect(() => {
        persistStore(store, null, () => {
            setBootstrapped(true);
        });
    }, [store]);

    return <Provider store={store}>
            <BootstrappedContext.Provider value={bootstrapped}>
                {children}
            </BootstrappedContext.Provider>
        </Provider>;
};
