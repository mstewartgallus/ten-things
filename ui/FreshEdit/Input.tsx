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

const getCaret = (node: Node) => {
    const range = window.getSelection()?.getRangeAt(0);
    if (!range) {
        return [0, 0];
    }
    if (range.startContainer !== node) {
        return [0, node.length];
    }
    return [range.startOffset, range.endOffset];
};

interface Modifiers {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

interface InsertText {
    type: 'insertText';
    data: string;
}
interface DeleteContentBackward {
    type: 'deleteContentBackward';
}
interface DeleteContentForward {
    type: 'deleteContentForward';
}

export type InputData =
    | InsertText
    | DeleteContentBackward
    | DeleteContentForward;

interface Props {
    disabled?: boolean;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    value?: string;

    selectionStart?: number;
    selectionEnd?: number;

    keyAction?: (key: string, modifiers: Readonly<Modifiers>) => boolean;
    inputAction?: (
        selectionStart: number, selectionEnd: number,
        input: Readonly<InputData>
    ) => Promise<void>;

    focusAction?: () => Promise<void>;
    blurAction?: () => Promise<void>;
}

const Input = ({
    disabled = false,
    'aria-describedby': describedby,
    'aria-invalid': invalid,
    value = '',
    selectionStart = 0,
    selectionEnd = 0,
    keyAction,
    inputAction,
    focusAction, blurAction
}: Props) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const textRef = useRef<TextNode>(null);
    const onClickTitle = useCallback(() => {
        ref.current!.focus();
    }, []);
    const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
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
    const onBeforeInput = useCallback(async (event: InputEvent) => {
        const [start, end] = getCaret(textRef.current!);

        //  https://w3c.github.io/input-event
        event.preventDefault();
        switch (event.inputType) {
            case 'insertFromYank':
            case 'insertFromDrop':
            case 'insertFromPaste':
            case 'insertText': {
                const text = event.data ?? event.dataTransfer?.getData('text');
                if (text) {
                    inputAction?.(start, end, { type: 'insertText', data: text });
                }
                break;
            }

            case 'insertLineBreak':
                inputAction?.(start, end, { type: 'insertText', data: ' ' });
                break;

            case 'deleteContentBackward':
                inputAction?.(start, end, { type: 'deleteContentBackward' });
                break;

            case 'deleteContentForward':
                inputAction?.(start, end, { type: 'deleteContentForward' });
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

    useEffect(() => {
        const elem = ref.current!;

        const text = document.createTextNode(value);
        textRef.current = text;
        elem.appendChild(text);

        const range = document.createRange();
        range.setStart(text, selectionStart);
        range.setEnd(text, selectionEnd);

        const selection = window.getSelection()!;
        selection.empty();
        selection.addRange(range);
        return () => {
            elem.removeChild(text);
        };
    }, [value, selectionStart, selectionEnd]);

    return <p className={styles.input}
                 aria-label="Title"
                 aria-disabled={disabled}
                 aria-describedby={describedby}
                 aria-required={true}
                 aria-invalid={invalid ? true : undefined}
                 role="textbox"
                 onClick={onClickTitle}
                 ref={ref} inputMode="text"
                 contentEditable={disabled ? undefined : true}
                    onKeyDown={onKeyDown}
    onFocus={focusAction} onBlur={blurAction} />;
};

export default Input;
