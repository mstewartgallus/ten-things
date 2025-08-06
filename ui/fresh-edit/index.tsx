"use client";

import type { ReactNode, Ref, ClipboardEvent, KeyboardEvent, InputEvent, FormEvent, JSX, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { Button } from "../button";
import { Time } from "../time";
import { Icon } from "../icon";
import { Input } from "../input";

import styles from "./FreshEdit.module.css";

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

const getCaret = () => {
    const selection = window.getSelection();
    if (!selection) {
        return [0, 0];
    }
    const range = selection.getRangeAt(0);
    return [range.startOffset, range.endOffset];
};

interface LayoutProps {
    children?: ReactNode;
    title?: ReactNode;
    titleButton?: ReactNode;
    completeButton: ReactNode;

    controlId: string;

    selected?: boolean;
    focus?: boolean;
}

export const FreshLayout = ({
    selected = false,
    focus = false,
    children,
    title,
    titleButton,
    controlId,
    completeButton
}: LayoutProps) =>
    <div className={styles.item}>
        <div className={styles.freshItem} data-selected={selected}>
            <div className={styles.inputWrapper} data-selected={selected} data-focus={focus}>
                <div className={styles.disclosureButton}>
                    {titleButton}
                </div>

                <div id={controlId} className={styles.title} data-selected={selected}>
                    {title}
                </div>
             </div>
        </div>

        <div className={styles.widgets}>
            {completeButton}
        </div>

        <div className={styles.metadata}>
            {children}
        </div>
    </div>;

interface ReadingProps {
    controlId: string;
    children?: ReactNode;
    disabled: boolean;
    entry?: Entry;
    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;
    completeAction?: () => Promise<void>;
}

export const FreshReading = ({
    controlId,
    entry,
    children,

    disabled,

    changeAction,
    toggleAction,
    completeAction
}: ReadingProps) => {
    const emptyValue = !entry;
    const value = entry && entry.value

    const onClick = useMemo(() => {
        if (!toggleAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await toggleAction();
        };
    }, [toggleAction]);

    const id = useId();
    return <FreshLayout
        controlId={controlId}
            titleButton={
                <Button aria-label={emptyValue ? 'Create Thing' : 'Edit Thing'}
                    disabled={disabled || !onClick}
                    onClick={onClick}
                    aria-expanded={false}
                    aria-controls={controlId}>
                    <Icon>{emptyValue ? '+' : '✎'}</Icon>
                </Button>
            }
            title={value ?? '...'}
            completeButton={
                completeAction
                    && <form id={id} action={completeAction}>
                        <Button disabled={disabled} aria-label="Complete Thing" value="complete">
                            <Icon>✔</Icon>
                        </Button>
                    </form>
            }>
            {children}
    </FreshLayout>;
};

interface EditingProps {
    controlId: string;
    children?: ReactNode;
    disabled: boolean;
    entry?: Entry;
    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;
    completeAction?: () => Promise<void>;
    maxLength?: number;
}

export const FreshEditing = ({
    controlId,
    children,

    disabled,

    entry,

    changeAction,
    toggleAction,

    completeAction,
    maxLength
}: EditingProps) => {
    const emptyValue = !entry;
    const initialValue = (entry && entry.value) ?? '';

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

    const [focus, setFocus] = useState(false);

    const onFocus = useCallback(async () => startTransition(() => setFocus(true)), []);
    const onBlur = useCallback(async () => startTransition(() => setFocus(false)), []);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    const [invalid, setInvalid] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [selection, setSelection] = useState<number | null>(null);

    const formAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async () => {
            await changeAction(value);
        };
    }, [changeAction, value]);

    const edit = useCallback(async (value: string, selection: number) => {
        setValue(value);
        setSelection(selection);
    }, []);

    const backspaceAction = useCallback(async () => {
        let [selectionStart, selectionEnd] = getCaret();
        if (selectionStart === selectionEnd) {
            selectionStart -= 1;
        }
        if (selectionStart < 0) {
            selectionStart = 0;
        }
        const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
        await edit(newValue, selectionStart);
    }, [value, edit]);

    const deleteAction = useCallback(async () => {
        let [selectionStart, selectionEnd] = getCaret();
        if (selectionStart === selectionEnd) {
            selectionEnd += 1;
        }
        if (selectionEnd >= value.length) {
            selectionEnd = value.length;
        }
        const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
        await edit(newValue, selectionStart);
    }, [value, edit]);

    const inputAction = useCallback(async (data: string) => {
        data = data.replace('\n', ' ');

        const [selectionStart, selectionEnd] = getCaret();
        const newValue =
            value.substring(0, selectionStart) +
            data +
            value.substring(selectionEnd);
        await edit(newValue, selectionStart + data.length);
    }, [value, edit]);

    const onBeforeInput = useCallback((e: InputEvent<HTMLDivElement>) => {
        e.preventDefault();
        inputAction(e.data);
    }, [inputAction]);

    const onPaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        inputAction(e.clipboardData.getData('text'));
    }, [inputAction]);

    // FIXME handle deletion better, also cut
    const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        const { key } = e;
        if (key !== 'Enter' && key !== 'Backspace' && key !== 'Delete') {
            return;
        }
        e.preventDefault();

        switch (key) {
            case 'Enter':
                buttonRef.current!.click();
                break;

            case 'Backspace':
                if (backspaceAction) {
                    backspaceAction();
                }
                break;
            case 'Delete':
                if (deleteAction) {
                    deleteAction();
                }
                break;
        }
    }, [invalid, backspaceAction, deleteAction]);

    useEffect(() => {
        const messages = [];
        const valueMissing = value.length === 0;
        const tooLong = !!maxLength && value.length >= maxLength;

        if (valueMissing) {
            // FIXME put cleaner error messages
            messages.push('Thing title is required');
        }
        if (tooLong) {
            // FIXME put cleaner error messages
            messages.push('Thing title is too long');
        }

        setInvalid(messages.length > 0);

        const elem = buttonRef.current;
        if (!elem) {
            return;
        }
        elem.setCustomValidity(messages.join('\n'));
    }, [maxLength, value]);

    // FIXME do this on focus...
    useEffect(() => {
        if (!selection) {
            return;
        }
        const elem = ref.current!;
        const sel = window.getSelection();
        if (!sel) {
            throw Error("huh?");
        }
        sel.collapse(elem.firstChild, selection);
    }, [selection]);

    const id = useId();

    return <FreshLayout
        selected={true}
        focus={focus}
        controlId={controlId}
        titleButton={
            <Button aria-label={emptyValue ? 'Cancel Create Thing' : 'Cancel Edit Thing'}
            disabled={disabled || !onClick}
            onClick={onClick}
            aria-expanded={true}
            aria-controls={controlId}>
                <Icon>🗙</Icon>
                </Button>
        }
        title={
            <div className={styles.inputWrapper}>
                    <div ref={ref}
                        className={styles.input}
                        inputMode="text"
                        role="textbox"
                        aria-disabled={disabled}
                        aria-required={true}
                        aria-invalid={invalid}
                        contentEditable={!disabled} suppressContentEditableWarning={true}
                        onBeforeInput={onBeforeInput}
                        onPaste={onPaste}
                        onKeyDown={onKeyDown}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        >
                        {value}
                    </div>
                </div>
        }
        completeButton={
            <form id={id} action={formAction}>
                    <Button ref={buttonRef} disabled={disabled} aria-label="Edit Thing">
                        <Icon>D</Icon>
                    </Button>
                </form>
        }
        >
        {children}
    </FreshLayout>;
};

interface Props {
    selected: boolean;

    children?: ReactNode;
    disabled: boolean;
    entry?: Entry;
    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;
    completeAction?: () => Promise<void>;
}

export const FreshEdit = (props: Props) => {
    const { selected, ...leftover } = props;
    const controlId = useId();

    if (!selected) {
        return <FreshReading {...leftover} controlId={controlId} />;
    }
    return <FreshEditing {...leftover} controlId={controlId} maxLength={300} />;
};
