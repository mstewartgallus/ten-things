"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "react-redux";
import { persistStore } from "redux-persist";

const BootstrappedContext = createContext<boolean>(false);

export const usePersistBootstrapped = () => useContext(BootstrappedContext);

interface Props {
    readonly children: ReactNode;
}

// FIXME fix hydration errors
export const PersistProvider = ({ children }: Props) => {
    const store = useStore();
    const [persisting, setPersisting] = useState(false);

    useEffect(() => {
        const persistor = persistStore(store, null, () => setPersisting(true));
        // FIXME purge?
        return () => {
            persistor.pause();
            setPersisting(false);
        };
    }, [store]);

    return <BootstrappedContext.Provider value={persisting}>
        {children}
    </BootstrappedContext.Provider>;
};
