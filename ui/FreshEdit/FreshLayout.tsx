"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { useFresh } from "./FreshProvider";

import styles from "./FreshEdit.module.css";

interface Props {
    children?: ReactNode;
    titleLabel?: ReactNode;
    info?: ReactNode;
    title?: ReactNode;
    titleButton?: ReactNode;
    completeButton?: ReactNode;

    formAction?: (event: FormData) => Promise<void>;
    selected?: boolean;
    focus?: boolean;
}

export const FreshLayout = ({
    selected = false,
    focus = false,
    children,
    info,
    titleLabel,
    title,
    titleButton,
    completeButton,
    formAction
}: Props) => {
    const { controlId, infoId } = useFresh();

    const id = useId();
    const formId = `${id}-${selected}`;
    const titleLabelId = useId();

    return <form aria-labelledby={titleLabelId} role={selected ? undefined : "presentation"}
                action={formAction} id={formId} className={styles.item}>
            <div id={titleLabelId} className={styles.titleLabel}>{titleLabel}</div>
            <div className={styles.freshItem} data-selected={selected}>
                <div className={styles.inputWrapper} data-selected={selected} data-focus={focus}>
                    <div className={styles.disclosureButton}>
                        {titleButton}
                    </div>

                    <div id={infoId} className={styles.info}>{info}</div>

                    <div id={controlId} className={styles.title} data-selected={selected}>
                        {title}
                    </div>

                     <div className={styles.widgets}>
                         {completeButton}
                     </div>
                </div>
            </div>

            <div className={styles.metadata}>
                {children}
            </div>
    </form>;
};
