import type { JSX } from "react";
import { withClass } from "../with-class";

import styles from "./Header.module.css";

const Header = withClass<JSX.IntrinsicElements['header']>('header', styles.header);

export default Header;
