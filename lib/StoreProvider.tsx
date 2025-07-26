"use client";

import type { ReactNode, Ref } from "react";
import type { Store } from "@reduxjs/toolkit";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useImperativeHandle, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

export interface StoreHandle {
    persist(): Promise<void>;
}

interface Props {
    readonly children: ReactNode;
    readonly ref: Ref<StoreHandle>
}

export const StoreProvider = ({ ref, children }: Props) => {
    const storeRef = useRef<Store>(null);
    const promiseRef = useRef<Promise<void>>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useImperativeHandle(ref, () => ({
        persist: async () => {
            const store = storeRef.current!;
            let persistPromise = promiseRef.current;

            if (!persistPromise) {
                persistPromise = new Promise<void>(res => persistStore(store, null, () => res()));
                promiseRef.current = persistPromise;
            }

            await persistPromise;
        }
    }), []);

    useEffect(() => setupListeners(storeRef.current!.dispatch), []);

    return <Provider store={storeRef.current!}>
            {children}
    </Provider>;
};
