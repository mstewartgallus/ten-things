import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Bag.module.css";

export const Bag = withClass<HTMLDivElement, JSX.IntrinsicElements['div']>('div', styles.bag);
