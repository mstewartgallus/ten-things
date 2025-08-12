import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Body.module.css";

const Body = withClass<JSX.IntrinsicElements["body"]>('body', styles.body);

export default Body;
