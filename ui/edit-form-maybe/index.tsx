'use client';

import type { JSX, MouseEvent } from "react";
import { If } from "../If";
import { Button } from "../button";
import { Icon } from "../icon";
import type { Ref, ChangeEvent, FormEvent } from "react";
import {
    useTransition, useCallback, useImperativeHandle, useMemo, useId, useRef, useState, useEffect
} from 'react';

import styles from "./EditFormMaybe.module.css";


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
    const [, startTransition] = useTransition();
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

    const ref = useRef<EditHandle>(null);
    const editValue = useEdit(ref, value);

    const [focus, setFocus] = useState(false);

    const onChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { currentTarget } = e;
        if (!currentTarget) {
            return;
        }
        e.preventDefault();
        ref.current!.change(currentTarget.value);
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

    const label = emptyValue ?
        (selected ? 'Cancel Create' : 'Create Thing') :
        (selected ? 'Cancel Edit' : 'Edit Thing');

    const onFocus = useCallback(() => startTransition(() => setFocus(true)), []);
    const onBlur = useCallback(() => startTransition(() => setFocus(false)), []);

    const controlId = useId();
    const formId = useId();

    return <div className={styles.editForm} data-editing={selected} data-focus={focus}>
            <Button aria-label={label} className={styles.button}
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
                        <form id={formId} action={formAction}>
        <input name="title" required
    maxLength={144} value={editValue} onChange={onChangeInput}
    onFocus={onFocus} onBlur={onBlur}
    className={styles.input}  />
                        </form>
                    </If>
                </div>
            </div>

            <If cond={selected}>
                <Button form={formId} disabled={disabled} className={styles.submit}>
                    Submit
                </Button>
            </If>
        </div>;
};
