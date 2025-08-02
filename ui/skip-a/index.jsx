'use client';

import { withClass } from "../with-class";
import { A } from "../a";
import styles from "./SkipA.module.css";

export const SkipA = withClass(A, styles.a);
