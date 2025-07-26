import type { JSX } from "react";
import { withClassServer } from "../with-class-server";
import styles from "./Nav.module.css";

export const Nav = withClassServer<HTMLElement, JSX.IntrinsicElements['nav']>('nav', styles.nav);
