import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Icon.module.css";

export const Icon = withClass<HTMLDivElement, JSX.IntrinsicElements["div"]>('div', styles.icon);
