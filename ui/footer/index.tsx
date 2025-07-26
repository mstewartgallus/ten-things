import type { JSX } from "react";
import { withClassServer } from "../with-class-server";

import styles from "./Footer.module.css";

export const Footer = withClassServer<HTMLElement, JSX.IntrinsicElements['footer']>('footer', styles.footer);
