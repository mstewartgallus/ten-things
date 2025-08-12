"use client";

import type { Ref, ReactNode, ClipboardEvent, KeyboardEvent, InputEvent, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { FreshLayout } from "./FreshLayout";
import { useFresh } from "./FreshProvider";
import Button from "../Button";
import Icon from "../Icon";

import styles from "./FreshEdit.module.css";

interface Modifiers {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

interface CaretHandle {
    focus(): void;
}

interface CaretProps {
    ref: Ref<CaretHandle>;
    disabled: boolean;

    // FIXME... make work async
    keyAction?: (key: string, modifiers: Readonly<Modifiers>) => boolean;
    inputAction?: (data: string) => Promise<void>;

    focusAction?: () => Promise<void>;
    blurAction?: () => Promise<void>;
}

const Caret = ({
    ref: handleRef,
    disabled,
    keyAction, inputAction,
    focusAction, blurAction
}: CaretProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    useImperativeHandle(handleRef, () => ({
        focus() {
            ref.current!.focus();
        }
    }), []);
    const onBeforeInput = useCallback((event: InputEvent<HTMLSpanElement>) => {
        console.log(event);
        console.log(event.nativeEvent);
        event.preventDefault();
        inputAction?.(event.data);
    }, [inputAction]);
    const onPaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        inputAction?.(e.clipboardData.getData('text'));
    }, [inputAction]);
    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {
        const { shiftKey, altKey, ctrlKey, metaKey } = event;
        if (!keyAction?.(event.key, { shiftKey, altKey, metaKey, ctrlKey })) {
            event.preventDefault();
        }
    }, [keyAction]);

    // FIXME... handle autocomplete
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1673558
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1763669

    return <span className={styles.caret} ref={ref}
       inputMode="text"
       contentEditable={disabled ? undefined : true}
       onBeforeInput={onBeforeInput}
       onPaste={onPaste}
       onKeyDown={onKeyDown}
       onFocus={focusAction} onBlur={blurAction} />;
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
    const [selection, setSelection] = useState<number>(0);

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

    const focusAction = useCallback(async () => startTransition(() => setFocus(true)), []);
    const blurAction = useCallback(async () => startTransition(() => setFocus(false)), []);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const ref = useRef<CaretHandle>(null);

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

    const leftAction = useCallback(async () => {
        setSelection(Math.max(selection - 1, 0));
    }, [selection]);
    const rightAction = useCallback(async () => {
        setSelection(Math.min(selection + 1, value.length));
    }, [selection, value]);

    const backspaceAction = useCallback(async () => {
        const pos = Math.max(selection - 1, 0);
        const newValue = value.substring(0, pos) + value.substring(selection);
        await edit(newValue, pos);
    }, [value, edit, selection]);

    const deleteAction = useCallback(async () => {
        const newValue = value.substring(0, selection) + value.substring(selection + 1);
        await edit(newValue, selection);
    }, [value, edit, selection]);

    const inputAction = useCallback(async (data: string) => {
        data = data.replace('\n', ' ');

        const newValue =
            value.substring(0, selection) +
            data +
            value.substring(selection);
        await edit(newValue, selection + data.length);
    }, [value, edit, selection]);

    // FIXME handle deletion better, also cut
    const keyAction = useCallback((key: string) => {
        switch (key) {
            case 'Enter':
                buttonRef.current!.click();
                return false;

            case 'ArrowLeft':
                leftAction?.();
                return false;

            case 'ArrowRight':
                rightAction?.();
                return false;

            case 'Backspace':
                backspaceAction?.();
                return false;

            case 'Delete':
                deleteAction?.();
                return false;
        }
        return true;
    }, [invalid, leftAction, rightAction, backspaceAction, deleteAction]);


    const onClickTitle = useCallback(() => {
        ref.current!.focus();
    }, []);

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
            <div className={styles.input}
                 aria-label="Title"
                 aria-disabled={disabled}
                 aria-describedby={infoId}
                 aria-required={true}
                 aria-invalid={invalid}
                 role="textbox"
                 onClick={onClickTitle}
                >
                {value.substring(0, selection)}
                <Caret ref={ref} disabled={disabled} inputAction={inputAction} keyAction={keyAction}
                   focusAction={focusAction} blurAction={blurAction} />
                {value.substring(selection)}
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
