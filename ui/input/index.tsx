'use client';

import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Input.module.css";

export const Input = (props: JSX.IntrinsicElements['textarea']) =>
    <span contentEditable={true} maxLength={144} rows={4} cols={40} className={styles.input} {...props} />;
