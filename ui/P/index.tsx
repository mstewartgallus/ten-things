import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./P.module.css";

const P = withClass<JSX.IntrinsicElements["p"]>('p', styles.p);

export default P;
