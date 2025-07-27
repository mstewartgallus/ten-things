'use client';

import type { JSX } from "react";
import { withClass } from "../with-class";
import styles from "./heading.module.css";

type Props = JSX.IntrinsicElements;

export const H1 = withClass<HTMLHeadingElement, Props['h1']>(
    'h1',
    styles.heading1);
export const H2 = withClass<HTMLHeadingElement, Props['h2']>(
    'h2',
    styles.heading2);
export const H3 = withClass<HTMLHeadingElement, Props['h3']>(
    'h3',
    styles.heading);
export const H4 = withClass<HTMLHeadingElement, Props['h4']>(
    'h4',
    styles.heading);
export const H5 = withClass<HTMLHeadingElement, Props['h5']>(
    'h5',
    styles.heading);
export const H6 = withClass<HTMLHeadingElement, Props['h6']>(
    'h6',
    styles.heading);
