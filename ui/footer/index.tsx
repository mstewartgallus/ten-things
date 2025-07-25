import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Footer.module.css";

export const Footer = withClass<HTMLElement, JSX.IntrinsicElements['footer']>('footer', styles.footer);
