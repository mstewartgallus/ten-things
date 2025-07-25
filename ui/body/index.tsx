'use client';

import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./Body.module.css";

export const Body = withClass<HTMLBodyElement, JSX.IntrinsicElements["body"]>('body', styles.body);
