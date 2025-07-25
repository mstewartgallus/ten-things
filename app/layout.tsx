import type { ReactNode } from "react";
import { A, Html, Body, Main, Nav, Footer, Header, useMainId } from "@/ui";
import { StoreProvider } from "@/lib";

import "./_ui/styles/globals.css";

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) =>
    <StoreProvider>
        <Html lang="en">
            <Body>
                <Header>
                    <Nav>
                        <A href="/">Fresh Things</A>
                        <A href="/complete">Complete Things</A>
                    </Nav>
                </Header>
                <Main>
                    {children}
                </Main>
                <Footer>
                    <Nav>
                        <A href="/about">About Ten Things</A>
                    </Nav>
                </Footer>
             </Body>
        </Html>
    </StoreProvider>;

export default RootLayout;
