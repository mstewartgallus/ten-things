import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./P.module.css";

export const P = withClass<JSX.IntrinsicElements["p"]>('p', styles.p);
