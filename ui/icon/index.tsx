import type { JSX } from "react";
import { withClassServer } from "../with-class-server";
import styles from "./Icon.module.css";

export const Icon = withClassServer<HTMLDivElement, JSX.IntrinsicElements["div"]>('div', styles.icon);
