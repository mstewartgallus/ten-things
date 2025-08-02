"use client";

import type { ReactNode, Ref, KeyboardEvent, InputEvent, ClipboardEvent } from "react";
import { createPortal } from "react-dom";
import {
    useEffect,
    useCallback, useMemo, useRef, useState
} from "react";


// FIXME.. do something better
declare global {
    interface ShadowRoot {
        getSelection?: () => Selection;
    }
}

const select = (node: Node, offset: number) => {
    const shadowRoot = node.getRootNode();
    if (shadowRoot instanceof ShadowRoot && shadowRoot.getSelection) {
        shadowRoot.getSelection()!.collapse(node, offset);
        return;
    }
    throw Error("no shadowroot selection polyfill");
}

const getCaret = (node: Node) => {
    const shadowRoot = node.getRootNode();
    // FIXME make work in Firefox
    if (shadowRoot instanceof ShadowRoot && shadowRoot.getSelection) {
        const range = shadowRoot.getSelection().getRangeAt(0);
        return [range.startOffset, range.endOffset];
    }
    throw Error("no shadowroot selection polyfill");
};

interface ImplProps {
    internals: ElementInternals;
    name?: string;
    maxLength?: number;
    required?: boolean;

    value?: string;
    selectionStart?: number;

    changeAction?: (value: string, selectionStart: number) => Promise<void>;
}

export const InputImpl = ({
    internals,
    name,
    value = '',
    selectionStart,
    maxLength,
    required = false,

    changeAction
}: ImplProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        internals.ariaRequired = required.toString();
    }, [internals, required]);

    useEffect(() => {
        internals.setFormValue(value ?? '');
    }, [internals, value]);

    const backspaceAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async () => {
            let [selectionStart, selectionEnd] = getCaret(ref.current!);
            if (selectionStart === selectionEnd) {
                selectionStart -= 1;
            }
            const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
            await changeAction(newValue, selectionStart);
        };
    }, [value]);

    const deleteAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async () => {
            let [selectionStart, selectionEnd] = getCaret(ref.current!);
            if (selectionStart === selectionEnd) {
                selectionEnd += 1;
            }
            const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
            await changeAction(newValue, selectionStart);
        };
    }, [value]);

    const inputAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async (data: string) => {
            data = data.replace('\n', ' ');

            const [selectionStart, selectionEnd] = getCaret(ref.current!);
            const newValue =
                value.substring(0, selectionStart) +
                data +
                value.substring(selectionEnd);
            const newSelection = selectionStart + data.length;
            await changeAction(newValue, newSelection);
        }
    }, [changeAction, value]);

    const onBeforeInput = useMemo(() => {
        if (!inputAction) {
            return;
        }
        return (e: InputEvent<HTMLDivElement>) => {
            e.preventDefault();

            if (!inputAction) {
                return;
            }

            inputAction(e.data);
        };
    }, [inputAction]);

    const onPaste = useMemo(() => {
        if (!inputAction) {
            return;
        }

        return (e: ClipboardEvent<HTMLDivElement>) => {
            e.preventDefault();
            inputAction(e.clipboardData.getData('text'));
        };
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
                const { form } = internals;
                if (!form) {
                    return;
                }

                form.requestSubmit();
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
    }, [internals, backspaceAction, deleteAction]);

    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!internals) {
            return;
        }

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

        internals.setValidity(
            flags,
            messages.join('\n'),
            errorRef.current!);
    }, [internals, required, value]);

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

    return <div part="input-wrapper">
           <div part="input">
              <slot>
                  <div part="input-inner" ref={ref} onBeforeInput={onBeforeInput}
                      onPaste={onPaste} onKeyDown={onKeyDown} inputMode="text"
                      tabIndex={0} contentEditable={true} suppressContentEditableWarning={true} />
              </slot>
           </div>
           <div ref={errorRef} part="error-anchor" />
        </div>;
};
