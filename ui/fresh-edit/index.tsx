"use client";

import { useMemo, useId } from 'react';

import { EntryEdit } from "../entry-edit";
import { Button } from "../button";
import { Icon } from "../icon";

import styles from "./FreshEdit.module.css";

interface Props {
    disabled: boolean;

    value: string;
    created: number;

    selected: boolean;

    // FIXME cleanup into single action hook?
    changeAction?: (value: string) => Promise<void>;
    selectAction?: () => Promise<void>;
    deselectAction?: () => Promise<void>;

    completeAction?: () => Promise<void>;
    deleteAction?: () => Promise<void>;
}

export const FreshEdit = ({
    disabled,

    value, created,
    selected,
    changeAction,
    selectAction, deselectAction,

    completeAction,
    deleteAction
}: Props) => {
    const id = useId();
    const emptyValue = value === '';

    return <div className={styles.freshSlot}>
         <EntryEdit disabled={disabled} value={value} created={created}
    changeAction={changeAction} selectAction={selectAction} deselectAction={deselectAction} />
        <form className={styles.form} id={id}>
        {
        emptyValue ?
                <Button disabled={disabled || selected} aria-label="Delete Thing" value="delete"
            formAction={deleteAction}>
                <Icon>🗑︎</Icon>
                </Button> :
                <Button disabled={disabled || selected} aria-label="Complete Thing" value="complete"
            formAction={completeAction}>
                <Icon>✔</Icon>
            </Button>
        }
    </form>
        </div>;
};
