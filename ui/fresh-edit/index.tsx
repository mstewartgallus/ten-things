import { useMemo } from 'react';

import { CompleteForm } from "../slot-controls";
import { EntryEdit } from "../entry-edit";

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
}: Props) =>
    <div className={styles.freshSlot}>
         <EntryEdit value={value} created={created}
    onChange={onChange} onSelect={onSelect} onDeselect={onDeselect} />
         <CompleteForm disabled={disabled || selected} onComplete={onComplete} />
        </div>;
