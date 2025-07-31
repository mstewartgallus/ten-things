"use client";

import type { ReactNode, Ref, KeyboardEvent, InputEvent, ClipboardEvent } from "react";
import { createPortal } from "react-dom";
import {
    createContext,
    useContext,
    useEffect,
    useImperativeHandle,
    useCallback, useMemo, useRef, useState
} from "react";

interface Context {
    internals: ElementInternals;
    shadowRoot: ShadowRoot;
}
const InputInternalsContext = createContext<Context | null>(null);

export const InputInternalsProvider = ({
    children, internals, shadowRoot
}: { children: ReactNode } & Context) => {
    const context = useMemo(
        () => ({ internals, shadowRoot }),
        [internals, shadowRoot]);
    return <InputInternalsContext value={context}>
        {children}
    </InputInternalsContext>;
};

// FIXME.. do something better
declare global {
    interface ShadowRoot {
        getSelection?: () => Selection;
    }
}

const select = (shadowRoot: ShadowRoot, node: Node, offset: number) => {
    if (shadowRoot.getSelection) {
        shadowRoot.getSelection()!.collapse(node, offset);
        return;
    }
    throw Error("no shadowroot selection polyfill");
}

const getCaret = (shadowRoot: ShadowRoot) => {
    // FIXME make work in Firefox
    if (shadowRoot.getSelection) {
        const range = shadowRoot.getSelection().getRangeAt(0);
        return [range.startOffset, range.endOffset];
    }
    throw Error("no shadowroot selection polyfill");
};

interface ImplProps {
    name?: string;
    value?: string;
    maxLength?: number;
    required?: boolean;
}

export const InputImpl = ({
    name: initName,
    value: initValue,
    maxLength: initMaxLength,
    required = false
}: ImplProps) => {
    const context = useContext(InputInternalsContext);
    if (!context) {
        throw Error("no context");
    }
    const { internals, shadowRoot } = context;

    const [name, setName] = useState<string | null>(initName ?? null);
    const [value, setValue] = useState<string>(initValue ?? '');
    const [maxLength, setMaxLength] = useState<number | null>(initMaxLength ?? null);
    const [selectionStart, setSelectionStart] = useState<number | null>(null);

    useEffect(() => {
        internals.role = 'textbox';
    }, [internals]);

    useEffect(() => {
        internals.ariaRequired = required.toString();
    }, [internals, required]);

    useEffect(() => {
        internals.setFormValue(value ?? '');
    }, [internals, value]);

    const changeAction = useCallback(async (
        value: string,
        selectionStart: number
    ) => {
        setValue(value);
        setSelectionStart(selectionStart);
    }, []);


    const backspaceAction = useCallback(async () => {
        let [selectionStart, selectionEnd] = getCaret(shadowRoot);
        if (selectionStart === selectionEnd) {
            selectionStart -= 1;
        }
        const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
        changeAction(newValue, selectionStart);
    }, [shadowRoot, value]);

    const deleteAction = useCallback(async () => {
        let [selectionStart, selectionEnd] = getCaret(shadowRoot);
        if (selectionStart === selectionEnd) {
            selectionEnd += 1;
        }
        const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
        changeAction(newValue, selectionStart);
    }, [shadowRoot, value]);

    const inputAction = useCallback(async (
        data: string
    ) => {
        data = data.replace('\n', ' ');

        const [selectionStart, selectionEnd] = getCaret(shadowRoot);
        const newValue =
            value.substring(0, selectionStart) +
            data +
            value.substring(selectionEnd);
        const newSelection = selectionStart + data.length;
        await changeAction(newValue, newSelection);
    }, [shadowRoot, changeAction, value]);

    const onBeforeInput = useCallback((e: InputEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (!inputAction) {
            return;
        }

        inputAction(e.data);
    }, [inputAction]);

    const onPaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (!inputAction) {
            return;
        }

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
                const { form } = internals;
                if (!form) {
                    return;
                }

                form.requestSubmit();
                break;

            case 'Backspace':
                backspaceAction();
                break;
            case 'Delete':
                deleteAction();
                break;
        }
    }, [internals, backspaceAction, deleteAction]);

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

        internals.setValidity(
            flags,
            messages.join('\n'),
            errorRef.current!);
    }, [internals, required, value]);

    const ref = useRef<HTMLDivElement>(null);
    const textRef = useRef<Text>(null);
    useEffect(() => {
        const elem = ref.current!;
        const text = document.createTextNode(value);

        elem.appendChild(text);
        if (selectionStart && selectionStart >= 0) {
            select(shadowRoot, text, selectionStart);
        }
        return () => {
            elem.removeChild(text);
        };
    }, [shadowRoot, value, selectionStart]);

    // FIXME handle cut event
    return <div className="inputWrapper">
           <div part="input" ref={ref} onBeforeInput={onBeforeInput}
           onPaste={onPaste} onKeyDown={onKeyDown} inputMode="text"
           tabIndex={0} contentEditable={true} suppressContentEditableWarning={true} />
           <div ref={errorRef} part="error-anchor" />
        </div>;
};
