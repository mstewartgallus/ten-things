"use client";

import type { Entry } from '@/lib';
import { useMemo, useId } from 'react';

import { EditFormMaybe } from "../edit-form-maybe";
import { Button } from "../button";
import { Time } from "../time";
import { Icon } from "../icon";

import styles from "./FreshEdit.module.css";

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

interface Props {
    disabled: boolean;

    entry?: Entry;

    selected: boolean;

    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;

    completeAction?: () => Promise<void>;
}

export const FreshEdit = ({
    disabled,

    entry,
    selected,

    changeAction,
    toggleAction,

    completeAction
}: Props) => {
    const id = useId();

    const emptyValue = entry === undefined;

    const value = entry && entry.value;
    const created = entry && entry.created;

    return <div className={styles.freshEdit}>
            <div className={styles.freshSlot}>
                <EditFormMaybe value={value} disabled={disabled} selected={selected}
                    changeAction={changeAction} toggleAction={toggleAction} />
                <form className={styles.form} id={id} action={completeAction}>
                {
                    completeAction &&
                        <Button disabled={disabled || selected}
                            aria-label="Complete Thing" value="complete">
                            <Icon>✔</Icon>
                        </Button>
                }
                </form>
            </div>
            <div className={styles.metadata}>
            {
                created ? <>Created: <Time>{created}</Time></> : null
            }
            </div>
        </div>;
};
