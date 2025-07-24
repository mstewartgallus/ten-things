import type { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";
import { withClass } from "../with-class";
import styles from "./Body.module.css";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;

export const Body = withClass<HTMLBodyElement, Props>(
    ({...props}) => <body {...props} />,
    styles.body);
