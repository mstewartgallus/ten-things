'use client';

import { withClass } from "../with-class";
import Link from "../Link";
import styles from "./A.module.css";

const A = withClass(Link, styles.a);

export default A;
