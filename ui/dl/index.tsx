import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./dl.module.css";

export const Dl = withClass<JSX.IntrinsicElements["dl"]>('dl', styles.dl);
export const Dd = withClass<JSX.IntrinsicElements["dd"]>('dd', styles.dd);
export const Dt = withClass<JSX.IntrinsicElements["dt"]>('dt', styles.dt);
