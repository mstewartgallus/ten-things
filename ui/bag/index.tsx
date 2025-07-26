import type { JSX } from "react";
import { withClassServer } from "../with-class-server";
import styles from "./Bag.module.css";

export const Bag = withClassServer<HTMLDivElement, JSX.IntrinsicElements['div']>('div', styles.bag);
