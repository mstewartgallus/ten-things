"use client";

import type { ReactNode, Ref, InputEvent, FormEvent, JSX, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { Button } from "../button";
import { Time } from "../time";
import { Icon } from "../icon";

import styles from "./FreshEdit.module.css";

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

interface InputProps {
    value?: string;
    focusAction?: () => Promise<void>;
    blurAction?: () => Promise<void>;
    inputAction?: (value: string) => Promise<void>;
}

const Input = ({ value = '', focusAction, blurAction, inputAction }: InputProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const onInput = useMemo(() => {
        if (!inputAction) {
            return;
        }
        return async (e: InputEvent<HTMLDivElement>) => {
            let text = ref.current!.value;
            await inputAction(text);
        };
    }, [inputAction]);

    return <textarea ref={ref} maxLength={300} required defaultValue={value}
     aria-label="Title"  data-selected={true}
    onFocus={focusAction} onBlur={blurAction} className={styles.input} onInput={onInput} />;
};

interface Props {
    listItemMarker: ReactNode;
    children?: ReactNode;

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
    const [editValue, setEditValue] = useState(value ?? '');

    const onClick = useMemo(() => {
        if (!toggleAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await toggleAction();
        };
    }, [toggleAction]);

    const [focus, setFocus] = useState(false);

    const formAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async () => {
            await changeAction(editValue);
        };
    }, [changeAction, editValue]);

    const focusAction = useCallback(async() => startTransition(() => setFocus(true)), []);
    const blurAction = useCallback(async() => startTransition(() => setFocus(false)), []);

    useEffect(() => {
        setEditValue(value ?? '');
    }, [value]);
    const inputAction = useCallback(async (value: string) => {
        setEditValue(value ?? '');
    }, []);

    const controlId = useId();
    const formId = useId();
    const id = useId();

    const label = emptyValue ?
        (selected ? 'Cancel Create' : 'Create Thing') :
        (selected ? 'Cancel Edit' : 'Edit Thing');

    const disclosureButton = <Button aria-label={label}
        disabled={disabled || !onClick}
        onClick={onClick}
        aria-expanded={selected}
        aria-controls={controlId}>
            <Icon>{selected ? '🗙' : emptyValue ? '+' : '✎'}</Icon>
        </Button>;
    const disclosure = selected
        ? <form id={formId} action={formAction}>
            <Input value={value} focusAction={focusAction} blurAction={blurAction} inputAction={inputAction} />
          </form>
        : <div className={styles.input}>{value ?? '...'}</div>;

    const completeButton = selected
        ? <Button form={formId} disabled={disabled} aria-label="Edit Thing">
              <Icon>D</Icon>
          </Button>
        : completeAction
        && <form id={id} action={completeAction}>
            <Button disabled={disabled || selected} aria-label="Complete Thing" value="complete">
                <Icon>✔</Icon>
            </Button>
        </form>;

    return <div className={styles.fresh}>
            <div className={styles.freshItem}>
                <div className={styles.editForm} data-focus={focus} data-selected={selected}>
                    <div className={styles.inputWrapper} data-focus={focus} data-selected={selected}>
                        <div className={styles.disclosureButton}>
                        {listItemMarker}
                        {disclosureButton}
                        </div>

                        <div id={controlId}>
                            {disclosure}
                        </div>
                    </div>
                    <div className={styles.floatRight}>
                         {completeButton}
                    </div>
                </div>

                <div className={styles.metadata}>
                    {children}
                </div>
            </div>
        </div>;
};
