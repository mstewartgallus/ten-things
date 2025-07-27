'use client';

import type { MouseEvent } from "react";
import { useMemo, useId } from 'react';
import { If } from "../If";
import { Button } from "../button";
import { Icon } from "../icon";
import { EditForm } from "../edit-form";

import styles from "./EditFormMaybe.module.css";

interface Props {
    disabled: boolean;
    selected: boolean;
    value?: string;
    changeAction?: (value: string) => void;
    toggleAction?: () => void;
}

export const EditFormMaybe = ({
    disabled,
    selected,
    value,
    changeAction, toggleAction
}: Props) => {
    const emptyValue = value === undefined;

    const onClick = useMemo(() => {
        if (!toggleAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await toggleAction();
        };
    }, [toggleAction]);

    const controlId = useId();
    const label = emptyValue ?
        (selected ? 'Cancel Create' : 'Create Thing') :
        (selected ? 'Cancel Edit' : 'Edit Thing');

    return <div className={styles.editableTitle}>
        <Button aria-label={label}
                disabled={disabled || !onClick}
                onClick={onClick}
                aria-expanded={selected}
                aria-controls={controlId}>
             <Icon>{selected ? '🗙' : emptyValue ? '+' : '✎'}</Icon>
        </Button>
        <div className={styles.titleAndInputWrapper}>
            <div id={controlId} className={styles.titleAndInput}>
                <If cond={!selected}>
                    <div className={styles.title}>{value}</div>
                </If>
                <If cond={selected}>
                    <EditForm disabled={disabled} value={value} changeAction={changeAction} />
                </If>
        </div>
        </div>
        </div>;
};
