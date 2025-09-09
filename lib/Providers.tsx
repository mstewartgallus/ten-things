"use client";

import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import type { Store } from "redux";
import type { Cursor, HtmlHandle } from "@/ui";
import {
    UiProvider, A, Bag, H2, Html, Header, Main, Nav, SkipA,
    SubtleA, Footer, P
} from "@/ui";
import { LibProvider } from "./LibProvider";
import StoreProvider from "./StoreProvider";
import { persistStore } from "redux-persist";

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
    children: ReactNode;
}

const Providers = ({ children }: Readonly<Props>) => {
    const storeRef = useRef<Store>(null);

    const ref = useRef<State>(null);
    if (!ref.current) {
        const { promise, resolve } = withResolvers<void>();
        ref.current = { init: false, promise, resolve };
    }

    const persist = useCallback(() => {
        const store = storeRef.current!;
        const { init, promise, resolve } = ref.current!;

        if (!init) {
            persistStore(store, null, () => resolve());
            ref.current!.init = true;
        }

        return promise;
    }, []);

    return <StoreProvider ref={storeRef}>
           <LibProvider persist={persist}>
              {children}
           </LibProvider>
        </StoreProvider>;
};


export default Providers;
