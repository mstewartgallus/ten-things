import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Nav.module.css";

const Nav = withClass<JSX.IntrinsicElements['nav']>('nav', styles.nav);

export default Nav;
