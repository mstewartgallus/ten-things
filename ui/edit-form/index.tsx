import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useId, useState } from 'react';
import { Button } from "../button";
import { Input } from "../input";

import styles from "./EditForm.module.css";

interface Props {
    value: string;

    onChange?: (value: string) => void;
}

export const EditForm = ({ value, onChange }: Props) => {
    const [editValue, setEditValue] = useState(value);

    const formId = useId();

    const onChangeInput = useMemo(() => {
        if (!onChange) {
            return;
        }
        return (e: ChangeEvent<HTMLInputElement>) => {
            const { target } = e;
            if (!target) {
                return;
            }
            e.preventDefault();
            setEditValue((target as HTMLInputElement).value);
        };
    }, [onChange]);

    const onSubmitForm = useMemo(() => {
        if (!onChange) {
            return;
        }
        return (e: FormEvent) => {
            e.preventDefault();
            onChange(editValue);
        };
    }, [editValue, onChange]);

    return <form className={styles.formButton} id={formId} action="#" onSubmit={onSubmitForm}>
            <Input disabled={!onChangeInput} required value={editValue} onChange={onChangeInput} />
            <Button disabled={!onSubmitForm}>
                Submit
            </Button>
        </form>;
};
