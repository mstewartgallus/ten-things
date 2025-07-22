import type { ReactNode } from "react";
import { Link } from "@/ui/link/Link";
import { Html } from "@/ui/html/Html";
import { inter } from "@/ui/fonts";
import { StoreProvider } from "@/lib/StoreProvider";

import "./_ui/styles/globals.css";
import styles from "./_ui/styles/layout.module.css";

const Nav = () =>
    <nav className={styles.nav}>
        <Link href="/">Fresh Things</Link>
        <Link href="/complete">Complete Things</Link>
    </nav>;

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) =>
    <Html lang="en">
        <body className={inter.className}>
             <Nav />
             <main className={styles.main}>
                 <StoreProvider>
                      {children}
                  </StoreProvider>
             </main>
         </body>
    </Html>;

export default RootLayout;
