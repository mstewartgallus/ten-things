'use client';

import type { JSX } from "react";
import { withClass } from "../with-class";
import { useMainLabelId } from "../main-label";
import styles from "./heading.module.css";

type Props = JSX.IntrinsicElements;

const RawH1 = withClass<Props['h1']>(
    'h1',
    styles.heading1);

export const H1 = ({ children, ...props }: Props['h1']) => {
    const id = useMainLabelId();
    return <RawH1 {...props}>
           <span id={id ?? undefined}>{children}</span>
        </RawH1>;
};

export const H2 = withClass<Props['h2']>(
    'h2',
    styles.heading2);
export const H3 = withClass<Props['h3']>(
    'h3',
    styles.heading);
export const H4 = withClass<Props['h4']>(
    'h4',
    styles.heading);
export const H5 = withClass<Props['h5']>(
    'h5',
    styles.heading);
export const H6 = withClass<Props['h6']>(
    'h6',
    styles.heading);
