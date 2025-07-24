import type { ReactElement } from "react";
import { body } from "./Body.module.css";

interface Props {
    children: ReactElement;
}

export const Body = ({ children }: Props) =>
    <body className={body}>{children}</body>;
