"use client";

import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import type { Store } from "redux";
import type { Cursor, HtmlHandle } from "@/ui";
import {
    UiProvider, A, Bag, H2, Html, Header, Main, Nav, SkipA,
    SubtleA, Footer, P
} from "@/ui";
import { Providers } from "@/lib";

import "./_ui/styles/globals.css";

interface Props {
    children: ReactNode;
}

interface State {
    init: boolean;
    readonly promise: Promise<void>;
    readonly resolve: () => void;
}

const RootLayout = ({ children }: Readonly<Props>) => {
    const htmlRef = useRef<HtmlHandle>(null);

    const onCursorChange = useCallback(
        (cursor?: Cursor) => htmlRef.current!.cursor(cursor),
        []);

    return <Html ref={htmlRef} lang="en">
        <body>
            <Nav>
                <Bag>
                    <A href="/">Fresh Things</A>
                    <A href="/archive">Archived Things</A>
                    <SkipA href="#footer">Skip to Footer</SkipA>
                </Bag>
            </Nav>
            <Main>
                <Providers>
                        <UiProvider onCursorChange={onCursorChange}>
                            {children}
                        </UiProvider>
                </Providers>
            </Main>
            <Footer>
                <Header>
                    <H2>
                        <SubtleA id="footer" href="#footer">About This Website</SubtleA>
                    </H2>
                </Header>
                <P>Just a little demo app by Molly Stewart-Gallus.</P>
                <P><A href="https://mstewartgallus.github.io/select-webapp">Select another app.</A></P>
            </Footer>
         </body>
    </Html>;
};

export default RootLayout;
