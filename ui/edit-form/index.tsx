import type { Ref, ChangeEvent, FormEvent } from "react";
import { useCallback, useImperativeHandle, useMemo, useId, useRef, useState } from 'react';
import { Button } from "../button";
import { Input } from "../input";

import styles from "./EditForm.module.css";

interface EditHandle {
    change(value: string): void;
}

const useEdit = (ref: Ref<EditHandle>, initValue: string) => {
    const [value, setValue] = useState(initValue);

    useImperativeHandle(ref, () => ({
        change: v => setValue(v)
    }), []);

    return value;
};

interface Props {
    value: string;

    onChange?: (value: string) => void;
}

export const EditForm = ({ value, onChange }: Props) => {
    const ref = useRef<EditHandle>(null);

    const editValue = useEdit(ref, value);

    const formId = useId();

    const onChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { target } = e;
        if (!target) {
            return;
        }
        e.preventDefault();
        ref.current!.change((target as HTMLInputElement).value);
    }, []);

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
