"use client";

type NativeEvent = Event;
type NativeInputEvent = InputEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeKeyboardEvent = KeyboardEvent;

import type { ReactNode, Ref, UIEvent, KeyboardEvent, InputEvent, ClipboardEvent } from "react";
import { createPortal } from "react-dom";
import {
    useEffect,
    useCallback, useMemo, useRef, useState
} from "react";

export interface TenInputElement extends HTMLElement {
    internals: ElementInternals;
    form: HTMLFormElement | null;
}

const select = (node: Node, offset: number) => {
    document.getSelection()!.collapse(node, offset);
}

interface ImplProps {
    getInternals(): ElementInternals;
    dispatchEvent(e: NativeEvent): boolean;

    name?: string;
    maxLength?: number;
    required?: boolean;

    value?: string;
    selectionStart?: number;

    changeAction?: (value: string, selectionStart: number) => Promise<void>;
}

export const InputImpl = ({
    getInternals,
    dispatchEvent,

    name,
    value = '',
    selectionStart,
    maxLength,
    required = false,

    changeAction
}: ImplProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const onBeforeInput = useCallback((e: InputEvent<HTMLDivElement>) => {
        const event = e.nativeEvent;
        if (!dispatchEvent(new InputEvent(event.type, event))) {
            e.preventDefault();
        }
    }, [dispatchEvent]);
    const onInput = useCallback((e: InputEvent<HTMLDivElement>) => {
        const event = e.nativeEvent;
        if (!dispatchEvent(new InputEvent(event.type, event))) {
            e.preventDefault();
        }
    }, [dispatchEvent]);
    const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        const event = e.nativeEvent;
        if (!dispatchEvent(new KeyboardEvent(event.type, event))) {
            e.preventDefault();
        }
    }, [dispatchEvent]);
    const onPaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
        const event = e.nativeEvent;
        if (!dispatchEvent(new ClipboardEvent(event.type, event))) {
            e.preventDefault();
        }
    }, [dispatchEvent]);

    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const messages = [];
        const flags: ValidityStateFlags = {
            valueMissing: required && value.length === 0,
            tooLong: !!maxLength && value.length >= maxLength
        };
        if (flags.valueMissing) {
            // FIXME put cleaner error messages
            messages.push('Value Missing');
        }
        if (flags.tooLong) {
            // FIXME put cleaner error messages
            messages.push('Too long value');
        }

        getInternals().setValidity(
            flags,
            messages.join('\n'),
            errorRef.current!);
    }, [getInternals, required, value]);

    useEffect(() => {
        getInternals().setFormValue(value);
    }, [getInternals, value]);
    const textRef = useRef<Text>(null);
    useEffect(() => {
        const elem = ref.current!;
        const text = document.createTextNode(value);

        elem.appendChild(text);
        if (selectionStart && selectionStart >= 0) {
            select(text, selectionStart);
        }
        return () => {
            elem.removeChild(text);
        };
    }, [value, selectionStart]);
    return <>
           <div part="input">
              <slot>
                 <div part="input-inner" ref={ref}
                      onBeforeInput={onBeforeInput}
                      onInput={onInput}
                      onPaste={onPaste}
                      onKeyDown={onKeyDown}
    inputMode="text"
                      contentEditable={true} />
              </slot>
           </div>
           <div ref={errorRef} part="error-anchor" />
        </>;
};
