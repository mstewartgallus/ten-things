import type { JSX } from "react";
import { withClassServer } from "../with-class-server";
import styles from "./Body.module.css";

export const Body = withClassServer<HTMLBodyElement, JSX.IntrinsicElements["body"]>('body', styles.body);
