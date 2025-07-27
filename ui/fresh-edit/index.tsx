"use client";

import { useId } from 'react';

import { EntryEdit } from "../entry-edit";
import { Button } from "../button";
import { Icon } from "../icon";

import styles from "./FreshEdit.module.css";

interface Props {
    disabled: boolean;

    value: string;
    created: number;

    selected: boolean;

    onChange?: (value: string) => void;
    onSelect?: () => void;
    onDeselect?: () => void;

    onComplete?: () => void;
}

export const FreshEdit = ({
    disabled,

    value, created,
    selected,
    onChange,
    onSelect, onDeselect,

    onComplete
}: Props) => {
    const id = useId();
    return <div className={styles.freshSlot}>
         <EntryEdit disabled={disabled} value={value} created={created}
    onChange={onChange} onSelect={onSelect} onDeselect={onDeselect} />
         <form className={styles.form} id={id} action={onComplete}>
             <Button disabled={disabled || selected} aria-label="Complete Thing" value="complete">
                <Icon>✔</Icon>
            </Button>
         </form>
        </div>;
};
