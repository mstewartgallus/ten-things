import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./dl.module.css";

export const Dl = withClass<JSX.IntrinsicElements["p"]>('dl', styles.dl);
export const Dd = withClass<JSX.IntrinsicElements["p"]>('dd', styles.dd);
export const Dt = withClass<JSX.IntrinsicElements["p"]>('dt', styles.dt);
