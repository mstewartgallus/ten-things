"use client";

import type { ReactNode } from "react";
import { useFresh } from "./FreshProvider";

import styles from "./FreshEdit.module.css";

interface Props {
    children?: ReactNode;
    title?: ReactNode;
    titleButton?: ReactNode;
    completeButton: ReactNode;

    selected?: boolean;
    focus?: boolean;
}

export const FreshLayout = ({
    selected = false,
    focus = false,
    children,
    title,
    titleButton,
    completeButton
}: Props) => {
    const { controlId } = useFresh();
    return <div className={styles.item}>
        <div className={styles.freshItem} data-selected={selected}>
            <div className={styles.inputWrapper} data-selected={selected} data-focus={focus}>
                <div className={styles.disclosureButton}>
                    {titleButton}
                </div>

                <div id={controlId} className={styles.title} data-selected={selected}>
                    {title}
                </div>
             </div>
        </div>

        <div className={styles.widgets}>
            {completeButton}
        </div>

        <div className={styles.metadata}>
            {children}
        </div>
        </div>;
};
