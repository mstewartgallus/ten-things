"use client";

import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import type { StoreHandle } from "@/lib";
import type { Cursor, HtmlHandle } from "@/ui";
import { UiProvider, A, Bag, Html, Body, Main, Nav, Footer } from "@/ui";
import { LibProvider, StoreProvider } from "@/lib";

import "./_ui/styles/globals.css";

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
    const persistRef = useRef<StoreHandle>(null);
    const htmlRef = useRef<HtmlHandle>(null);

    const onPersist = useCallback(
        () => persistRef.current!.persist(),
        []);
    const onCursorChange = useCallback(
        (cursor?: Cursor) => htmlRef.current!.cursor(cursor),
        []);

    return <Html ref={htmlRef} lang="en">
        <Body>
            <Nav>
                <Bag>
                    <A href="/">Fresh Things</A>
                    <A href="/complete">Complete Things</A>
                </Bag>
            </Nav>
            <Main>
                <StoreProvider ref={persistRef}>
                   <LibProvider onPersist={onPersist}>
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
