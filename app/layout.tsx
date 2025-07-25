import type { ReactNode } from "react";
import { A, Bag, Html, Body, Main, Nav, Footer } from "@/ui";
import { StoreProvider } from "@/lib";

import "./_ui/styles/globals.css";

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) =>
    <StoreProvider>
        <Html lang="en">
            <Body>
                <Nav>
                    <Bag>
                        <A href="/">Fresh Things</A>
                        <A href="/complete">Complete Things</A>
                    </Bag>
                </Nav>
                <Main>
                    {children}
                </Main>
                <Footer>
                    <Bag>
                        <A href="/about">About Ten Things</A>
                    </Bag>
                </Footer>
             </Body>
        </Html>
    </StoreProvider>;

export default RootLayout;
