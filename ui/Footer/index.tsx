import type { JSX } from "react";
import { withClass } from "../with-class";

import styles from "./Footer.module.css";

const Footer = withClass<JSX.IntrinsicElements['footer']>('footer', styles.footer);

export default Footer;
