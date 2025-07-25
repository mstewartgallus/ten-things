'use client';

import { ReactElement } from "react";
import { useMainId } from "../main";
import styles from "./MainLabel.module.css";

interface Props {
    readonly children: ReactElement;
}

export const MainLabel = ({ children }: Props) => {
    const id = useMainId();
    return <div className={styles.mainlabel} id={id ?? undefined}>
        {children}
        </div>;
};
