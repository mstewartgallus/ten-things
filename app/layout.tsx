"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Store } from "redux";
import type { Cursor, HtmlHandle } from "@/ui";
import { UiProvider, A, Bag, Html, Body, Main, Nav, Footer } from "@/ui";
import { LibProvider, StoreProvider } from "@/lib";
import { persistStore } from "redux-persist";

import "./_ui/styles/globals.css";

interface Props {
  readonly children: ReactNode;
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

interface State {
    init: boolean;
    readonly promise: Promise<void>;
    readonly resolve: () => void;
}

const RootLayout = ({ children }: Props) => {
    const storeRef = useRef<Store>(null);
    const htmlRef = useRef<HtmlHandle>(null);

    const ref = useRef<State>(null);
    if (!ref.current) {
        const { promise, resolve } = withResolvers<void>();
        ref.current = { init: false, promise, resolve };
    }

    const onCursorChange = useCallback(
        (cursor?: Cursor) => htmlRef.current!.cursor(cursor),
        []);

    const persist = useCallback(() => {
        const store = storeRef.current!;
        const { init, promise, resolve } = ref.current!;

        if (!init) {
            persistStore(store, null, () => resolve());
            ref.current!.init = true;
        }

        return promise;
    }, []);

    return <Html ref={htmlRef} lang="en">
        <Body>
            <Nav>
                <Bag>
                    <A href="/">Fresh Things</A>
                    <A href="/complete">Complete Things</A>
                </Bag>
            </Nav>
            <Main>
                <StoreProvider ref={storeRef}>
                    <LibProvider persist={persist}>
                        <UiProvider onCursorChange={onCursorChange}>
                            {children}
                        </UiProvider>
                    </LibProvider>
                </StoreProvider>
            </Main>
            <Footer>
                <Bag>
                    <A href="/about">About Ten Things</A>
                </Bag>
            </Footer>
         </Body>
    </Html>;
};

export default RootLayout;
