import type { ReactNode } from "react";
import { A } from "@/ui";
import { Html } from "@/ui/html/Html";
import { Body } from "@/ui/body/Body";
import { StoreProvider } from "@/lib/StoreProvider";

import "./_ui/styles/globals.css";
import styles from "./_ui/styles/layout.module.css";

const Nav = () =>
    <nav className={styles.nav}>
        <A href="/">Fresh Things</A>
        <A href="/complete">Complete Things</A>
    </nav>;

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) =>
    <Html lang="en">
        <Body>
            <Nav />
            <main className={styles.main}>
                <StoreProvider>
                     {children}
                 </StoreProvider>
             </main>
         </Body>
    </Html>;

export default RootLayout;
