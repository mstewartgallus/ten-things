import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Nav.module.css";

export const Nav = withClass<HTMLElement, JSX.IntrinsicElements['nav']>('nav', styles.nav);
