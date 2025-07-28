import type { Ref, ChangeEvent, FormEvent } from "react";
import {
    useCallback, useImperativeHandle, useMemo, useId, useRef, useState, useEffect
} from 'react';
import { Button } from "../button";
import { Input } from "../input";

import styles from "./EditForm.module.css";

interface EditHandle {
    change(value: string): void;
}

const useEdit = (ref: Ref<EditHandle>, initValue?: string) => {
    const [value, setValue] = useState(initValue ?? '');

    useImperativeHandle(ref, () => ({
        change: v => setValue(v)
    }), []);

    return value;
};

interface Props {
    disabled: boolean;
    value?: string;

    changeAction?: (value: string) => void;
}

export const EditForm = ({ disabled, value, changeAction }: Props) => {
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

    const formAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async (formData: FormData) => {
            const title = (formData.get('title') ?? '') as string;
            await changeAction(title);
        };
    }, [changeAction]);

    return <form className={styles.editForm} id={formId} action={formAction}>
            <Input name="title" disabled={disabled} required value={editValue} onChange={onChangeInput} />
               <Button disabled={disabled} className={styles.float}>
                   Submit
              </Button>
        </form>;
};
