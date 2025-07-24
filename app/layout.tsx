import type { ReactNode } from "react";
import { A, Html, Body } from "@/ui";
import { StoreProvider } from "@/lib";

import "./_ui/styles/globals.css";
import styles from "./_ui/styles/layout.module.css";

const Header = () =>
    <header>
        <nav className={styles.nav}>
            <A href="/">Fresh Things</A>
            <A href="/complete">Complete Things</A>
        </nav>
    </header>;

const Footer = () =>
    <footer>
        <nav className={styles.nav}>
            <A href="/about">About Ten Things</A>
        </nav>
    </footer>;

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) =>
    <StoreProvider>
        <Html lang="en">
            <Body>
                <Header />
                <main className={styles.main}>
                    {children}
                </main>
                <Footer />
             </Body>
        </Html>
    </StoreProvider>;

export default RootLayout;
