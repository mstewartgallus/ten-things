'use client';

import { withClass } from "../with-class";
import { Link } from "../link";
import styles from "./A.module.css";

export const A = withClass(Link, styles.a);
