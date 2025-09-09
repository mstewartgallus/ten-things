"use client";

import type { Ref, ReactNode, ClipboardEvent, KeyboardEvent, MouseEvent } from "react";
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
import type { InputData } from "./Input";
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
    const [[start, end], setSelection] = useState<[number, number]>([0, 0]);

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

    const cancelRef = useRef<HTMLButtonElement>(null);
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
        setSelection([selection, selection]);
    }, []);

    const inputAction = useCallback(async (
        start: number, end: number,
        input: InputData
    ) => {
        switch (input.type) {
            case 'insertText': {
                const data = input.data.replace('\n', ' ');

                const newValue =
                    value.substring(0, start) +
                    data +
                    value.substring(end);
                await edit(newValue, start + data.length);
                break;
            }

            case 'deleteContentBackward': {
                if (start === end) {
                    const newStart = Math.max(start - 1, 0);
                    const newValue =
                        value.substring(0, newStart )
                        + value.substring(start);
                    await edit(newValue, newStart);
                    return;
                }
                const newValue =
                    value.substring(0, start) + value.substring(end);
                await edit(newValue, start);
                break;
            }

            case 'deleteContentForward': {
                if (start === end) {
                    const newValue =
                        value.substring(0, start) + value.substring(start + 1);
                    await edit(newValue, start);
                    return;
                }
                const newValue =
                    value.substring(0, start) + value.substring(end);
                await edit(newValue, start);
                break;
            }
        }
    }, [value, edit, start, end]);

    // FIXME handle deletion better, also cut
    const keyAction = useCallback((key: string) => {
        switch (key) {
            case 'Enter':
                buttonRef.current!.click();
                return false;

            case 'Escape':
                cancelRef.current!.click();
                return false;
        }
        return true;
    }, []);


    const { controlId, infoId } = useFresh();
    return <FreshLayout
        formAction={formAction}
        selected={true}
        focus={focus}
        titleButton={
            <Button ref={cancelRef} aria-label={emptyValue ? 'Cancel Create Thing' : 'Cancel Edit Thing'}
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
               selectionStart={start}
               selectionEnd={end}
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
