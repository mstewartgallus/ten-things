import type { JSX } from "react";
import { withClassServer } from "../with-class-server";
import styles from "./P.module.css";

export const P = withClassServer<HTMLParagraphElement, JSX.IntrinsicElements["p"]>('p', styles.p);
