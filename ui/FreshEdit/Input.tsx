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
    disabled?: boolean;
    'aria-describedby'?: string;
    'aria-invalid'?: string;
    value?: string;
    selection?: number

    keyAction?: (key: string, modifiers: Readonly<Modifiers>) => boolean;
    inputAction?: (data: string) => Promise<void>;

    focusAction?: () => Promise<void>;
    blurAction?: () => Promise<void>;
}

const Input = ({
    disabled = false,
    'aria-describedby': describedby,
    'aria-invalid': invalid,
    value = '',
    selection = 0,
    keyAction, inputAction,
    focusAction, blurAction
}: Props) => {
    const ref = useRef<CaretHandle>(null);
    const onClickTitle = useCallback(() => {
        ref.current!.focus();
    }, []);

    return <div className={styles.input}
                 aria-label="Title"
                 aria-disabled={disabled}
                 aria-describedby={describedby}
                 aria-required={true}
                 aria-invalid={invalid}
                 role="textbox"
                 onClick={onClickTitle}
                >
                {value.substring(0, selection)}
                <Caret ref={ref} disabled={disabled} inputAction={inputAction} keyAction={keyAction}
                   focusAction={focusAction} blurAction={blurAction} />
                {value.substring(selection)}
    </div>;
};

export default Input;
