"use client";

import type { Ref, ReactNode, ClipboardEvent, KeyboardEvent, InputEvent, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { FreshLayout } from "./FreshLayout";
import { useFresh } from "./FreshProvider";
import Input from "./Input";
import Button from "../Button";
import Icon from "../Icon";

import styles from "./FreshEdit.module.css";

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
        title={<Input
               disabled={disabled}
               aria-describedby={infoId}
               aria-invalid={invalid}
               value={value}
               selection={selection}
               keyAction={keyAction}
               inputAction={inputAction}
               focusAction={focusAction}
               blurAction={blurAction}
            />}
        completeButton={
            <Button ref={buttonRef} disabled={disabled || invalid} aria-label="Edit Thing">
                <Icon>D</Icon>
            </Button>
        }
        >
        {children}
    </FreshLayout>;
};
