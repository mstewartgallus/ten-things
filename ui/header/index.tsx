import type { JSX } from "react";
import { withClass } from "../with-class";

import styles from "./Header.module.css";

export const Header = withClass<HTMLElement, JSX.IntrinsicElements['header']>('header', styles.header);
