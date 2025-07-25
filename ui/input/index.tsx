'use client';

import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Input.module.css";

export const Input = withClass<HTMLInputElement, JSX.IntrinsicElements['input']>('input', styles.input);
