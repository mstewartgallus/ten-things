import type { JSX } from "react";
import { withClass } from "../with-class";

import styles from "./Icon.module.css";

const Icon = withClass<JSX.IntrinsicElements["div"]>('div', styles.icon);

export default Icon;
