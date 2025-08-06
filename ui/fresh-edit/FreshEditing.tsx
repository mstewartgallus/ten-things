"use client";

import type { ReactNode, ClipboardEvent, KeyboardEvent, InputEvent, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { FreshLayout } from "./FreshLayout";
import { useFresh } from "./FreshProvider";
import { Button } from "../button";
import { Icon } from "../icon";

import styles from "./FreshEdit.module.css";

const getCaret = () => {
    const selection = window.getSelection();
    if (!selection) {
        return [0, 0];
    }
    const range = selection.getRangeAt(0);
    return [range.startOffset, range.endOffset];
};

interface Props {
    children?: ReactNode;
    disabled: boolean;
    entry?: Entry;
    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;
    completeAction?: () => Promise<void>;
    maxLength?: number;
}

export const FreshEditing = ({
    children,

    disabled,

    entry,

    changeAction,
    toggleAction,

    completeAction,
    maxLength
}: Props) => {
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
    const [value, setValue] = useState(initialValue);
    const [selection, setSelection] = useState<number | null>(null);

    const errorMessages = useMemo(() => {
        const messages = []
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
        return messages;
    }, [value, maxLength]);

    const invalid = errorMessages.length > 0;

    const onFocus = useCallback(async () => startTransition(() => setFocus(true)), []);
    const onBlur = useCallback(async () => startTransition(() => setFocus(false)), []);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const ref = useRef<HTMLDivElement>(null);

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

    const { controlId, infoId } = useFresh();
    return <FreshLayout
        formAction={formAction}
        selected={true}
        focus={focus}
        titleButton={
            <Button aria-label={emptyValue ? 'Cancel Create Thing' : 'Cancel Edit Thing'}
            disabled={disabled || !onClick}
            onClick={onClick}
            aria-expanded={true}
            aria-controls={controlId}>
                <Icon>🗙</Icon>
                </Button>
        }
        info={<>{value.length} / {maxLength}</>}
        titleLabel={initialValue}
        title={
            <div ref={ref}
                        className={styles.input}
                        inputMode="text"
                        role="textbox"
                        aria-label="Title"
                        aria-disabled={disabled}
                        aria-describedby={infoId}
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
        }
        completeButton={
            <Button ref={buttonRef} disabled={disabled || invalid} aria-label="Edit Thing">
                <Icon>D</Icon>
            </Button>
        }
        >
        {children}
    </FreshLayout>;
};
