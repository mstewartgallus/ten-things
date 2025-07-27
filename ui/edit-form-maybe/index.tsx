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
    onChange?: (value: string) => void;
    onSelect?: () => void;
    onDeselect?: () => void;
}

export const EditFormMaybe = ({
    disabled,
    value,
    onChange, onSelect, onDeselect
}: Props) => {
    const selected = !onSelect;

    const onToggle = onSelect || onDeselect;

    const onSubmit = useMemo(() => {
        if (!onChange || !onDeselect) {
            return;
        }
        return (value: string) => {
            onChange(value);
            onDeselect();
        };
    }, [onChange, onDeselect]);

    const controlId = useId();

    const onToggleClick = useMemo(() => {
        if (!onToggle) {
            return;
        }
        return (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            onToggle();
        };
    }, [onToggle]);

    return <div className={styles.editableTitle}>
          <Button aria-label={selected ? 'Cancel Edit' : 'Edit'}
                disabled={disabled || !onToggleClick}
                onClick={onToggleClick}
                aria-expanded={selected}
                aria-controls={controlId}>
                <Icon>{selected ? '🗙' : '✎'}</Icon>
            </Button>
            <div id={controlId} className={styles.titleAndInput}>
                <If cond={!selected}>
                    <div className={styles.title}>{value}</div>
                </If>
                <If cond={selected}>
                    <EditForm disabled={disabled} value={value} onChange={onSubmit} />
                </If>
            </div>
        </div>;
};
