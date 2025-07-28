"use client";

import type { ReactNode, Ref, ChangeEvent, FormEvent, JSX, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { Button } from "../button";
import { Time } from "../time";
import { Icon } from "../icon";
import { If } from "../If";

import styles from "./FreshEdit.module.css";

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

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
    listItemMarker: ReactNode;
    children: ReactNode;

    disabled: boolean;

    entry?: Entry;

    selected: boolean;

    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;

    completeAction?: () => Promise<void>;
}

export const FreshEdit = ({
    listItemMarker,
    children,

    disabled,

    entry,
    selected,

    changeAction,
    toggleAction,

    completeAction
}: Props) => {
    const value = entry && entry.value;
    const created = entry && entry.created;
    const emptyValue = value === undefined;

    const [, startTransition] = useTransition();

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
    const id = useId();

    return <div className={styles.fresh}>
        {listItemMarker}
        <div className={styles.freshItem}>
        <div className={styles.editForm}>
                    <Button aria-label={label}
                                disabled={disabled || !onClick}
                                onClick={onClick}
                                aria-expanded={selected}
                                aria-controls={controlId}>
                             <Icon>{selected ? '🗙' : emptyValue ? '+' : '✎'}</Icon>
                    </Button>

                    <div id={controlId} className={styles.titleAndInput}>
                        <If cond={!selected}>
                            <div className={styles.title}>{value ?? '...'}</div>
                        </If>
                            <If cond={selected}>
        <form id={formId} action={formAction} className={styles.inputForm}>
                <input name="title" required
            maxLength={144} value={editValue} onChange={onChangeInput}
            onFocus={onFocus} onBlur={onBlur}
            className={styles.input} data-focus={focus} />
                                </form>
                            </If>
                    </div>

                <If cond={selected}>
                    <Button form={formId} disabled={disabled}>
                        Submit
                    </Button>
                </If>
                <If cond={!!(!selected && completeAction)}>
                    <form id={id} action={completeAction}>
                        <Button disabled={disabled || selected}
                                aria-label="Complete Thing" value="complete">
                            <Icon>✔</Icon>
                        </Button>
                    </form>
                </If>
           </div>
            <div className={styles.metadata}>
                {children}
            </div>
          </div>
        </div>;
};
