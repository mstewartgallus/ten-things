"use client";

import type { ReactNode, Ref } from "react";
import type { Store } from "@reduxjs/toolkit";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useImperativeHandle, useEffect, useRef } from "react";
import { Provider } from "react-redux";

interface Props {
    children: ReactNode;
    ref: Ref<Store>
}

const StoreProvider = ({ ref, children }: Readonly<Props>) => {
    const storeRef = useRef<Store>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useImperativeHandle(ref, () => storeRef.current!, []);

    useEffect(() => setupListeners(storeRef.current!.dispatch), []);

    return <Provider store={storeRef.current!}>
            {children}
    </Provider>;
};

export default StoreProvider;
