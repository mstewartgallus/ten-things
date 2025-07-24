import type { ComponentType, DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";
import { withClass } from "../with-class";
import styles from "./heading.module.css";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export const H1 = withClass<HTMLHeadingElement, Props>(
    ({...props}) => <h1 {...props} />,
    styles.heading1);
export const H2 = withClass<HTMLHeadingElement, Props>(
    ({...props}) => <h2 {...props} />,
    styles.heading2);
export const H3 = withClass<HTMLHeadingElement, Props>(
    ({...props}) => <h3 {...props} />,
    styles.heading);
export const H4 = withClass<HTMLHeadingElement, Props>(
        ({...props}) => <h4 {...props} />,
    styles.heading);
export const H5 = withClass<HTMLHeadingElement, Props>(
    ({...props}) => <h5 {...props} />,
    styles.heading);
export const H6 = withClass<HTMLHeadingElement, Props>(
    ({...props}) => <h6 {...props} />,
    styles.heading);
