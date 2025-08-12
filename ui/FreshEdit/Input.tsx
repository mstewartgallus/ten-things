"use client";

import type { Ref, ReactNode, ClipboardEvent, KeyboardEvent, MouseEvent } from "react";
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

interface Props {
    disabled?: boolean;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
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
    const ref = useRef<HTMLSpanElement>(null);
    const onClickTitle = useCallback(() => {
        ref.current!.focus();
    }, []);
    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {
        const { shiftKey, altKey, ctrlKey, metaKey } = event;
        if (!keyAction?.(event.key, { shiftKey, altKey, metaKey, ctrlKey })) {
            event.preventDefault();
        }
    }, [keyAction]);

    // FIXME... handle autocomplete
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1673558
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1763669

    // FIXME I think the caret trick doesn't really work and you need
    // to just handle all the separate inputType events
    const onBeforeInput = useCallback((event: InputEvent) => {
        //  https://w3c.github.io/input-event
        event.preventDefault();
        switch (event.inputType) {
            case 'insertFromYank':
            case 'insertFromDrop':
            case 'insertFromPaste':
            case 'insertText': {
                const text = event.data ?? event.dataTransfer?.getData('text');
                if (text) {
                    inputAction?.(text.replace('\n', ' '));
                }
                break;
            }

            case 'insertLineBreak':
                inputAction?.(' ');
                break;

            default:
                console.warn(`unhandled input event type ${event.inputType}`);
                break;
        }
    }, [inputAction]);

    useEffect(() => {
        // React doesn't really give us enough control here
        // unfortunately and just abuses TextEvent
        const aborter = new AbortController();
        ref.current!.addEventListener('beforeinput', onBeforeInput, {
            signal: aborter.signal
        });
        return () => aborter.abort();
    }, [onBeforeInput]);

    return <div className={styles.input}
                 aria-label="Title"
                 aria-disabled={disabled}
                 aria-describedby={describedby}
                 aria-required={true}
                 aria-invalid={invalid ? true : undefined}
                 role="textbox"
                 onClick={onClickTitle}
                >
                {value.substring(0, selection)}
                <span className={styles.caret} ref={ref} inputMode="text"
                    contentEditable={disabled ? undefined : true}
                    onKeyDown={onKeyDown}
                    onFocus={focusAction} onBlur={blurAction} />
               {value.substring(selection)}
        </div>;
};

export default Input;
