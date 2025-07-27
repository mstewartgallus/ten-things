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
    value: string;
    changeAction?: (value: string) => void;
    selectAction?: () => void;
    deselectAction?: () => void;
}

export const EditFormMaybe = ({
    disabled,
    value,
    changeAction, selectAction, deselectAction
}: Props) => {
    const selected = !selectAction;

    const toggleAction = selectAction || deselectAction;

    const onClick = useMemo(() => {
        if (!toggleAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await toggleAction();
        };
    }, [toggleAction]);

    const editAction = useMemo(() => {
        if (!changeAction || !deselectAction) {
            return;
        }
        return async (value: string) => {
            await changeAction(value);
            await deselectAction();
        };
    }, [changeAction, deselectAction]);

    const controlId = useId();

    return <div className={styles.editableTitle}>
          <Button aria-label={selected ? 'Cancel Edit' : 'Edit'}
                disabled={disabled || !onClick}
                onClick={onClick}
                aria-expanded={selected}
                aria-controls={controlId}>
                <Icon>{selected ? '🗙' : '✎'}</Icon>
            </Button>
            <div id={controlId} className={styles.titleAndInput}>
                <If cond={!selected}>
                    <div className={styles.title}>{value}</div>
                </If>
                <If cond={selected}>
                    <EditForm disabled={disabled} value={value} changeAction={editAction} />
                </If>
            </div>
        </div>;
};
