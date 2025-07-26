import type { JSX } from "react";
import { withClassServer } from "../with-class-server";

import styles from "./Header.module.css";

export const Header = withClassServer<HTMLElement, JSX.IntrinsicElements['header']>('header', styles.header);
