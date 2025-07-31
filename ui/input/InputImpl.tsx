"use client";

import type { ReactNode, Ref, KeyboardEvent, InputEvent, ClipboardEvent } from "react";
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

const select = (shadowRoot: ShadowRoot, node: Node, offset: number) => {
    // FIXME use shadowroot
    shadowRoot.getSelection()!.collapse(node, offset);
}

interface TextProps {
    ref?: Ref<Text>;
    value?: string;
    selectionStart?: number;
}

const TextNode = ({
    ref,
    value = '', selectionStart
}: TextProps) => {
    // FIXME...
    const { shadowRoot } = useContext(InputInternalsContext)!;
    const textRef = useRef<Text>(null);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const elem = divRef.current!;
        const text = document.createTextNode('');
        elem.appendChild(text);
        textRef.current = text;
        return () => {
            elem.removeChild(text);
        };
    }, []);

    // FIXME handle whitespace appropriately
    useEffect(() => {
        const text = textRef.current!;
        text.nodeValue = value;
        if (selectionStart) {
            select(shadowRoot, text, selectionStart);
        }
    }, [shadowRoot, value, selectionStart]);

    useImperativeHandle(ref, () => textRef.current!, []);

    return <div ref={divRef} />;
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

    const textRef = useRef<Text>(null);
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

    const getCaret = useCallback(() => {
        const range = shadowRoot.getSelection().getRangeAt(0);
        return [range.startOffset, range.endOffset];
    }, [shadowRoot]);

    const changeAction = useCallback(async (
        value: string,
        selectionStart: number
    ) => {
        setValue(value);
        setSelectionStart(selectionStart);
    }, []);


    const backspaceAction = useCallback(async () => {
        let [selectionStart, selectionEnd] = getCaret();
        // FIXME... get selection....
        if (selectionStart === selectionEnd) {
            selectionStart -= 1;
        }
        const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
        changeAction(newValue, selectionStart);
    }, [value]);

    const deleteAction = useCallback(async () => {
        let [selectionStart, selectionEnd] = getCaret();
        // FIXME... get selection....
        if (selectionStart === selectionEnd) {
            selectionEnd += 1;
        }
        const newValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
        changeAction(newValue, selectionStart);
    }, [value]);

    const inputAction = useCallback(async (
        data: string
    ) => {
        data = data.replace('\n', ' ');
        if (maxLength) {
            data = data.substring(0, maxLength - value.length);
        }

        const [selectionStart, selectionEnd] = getCaret();
        const newValue =
            value.substring(0, selectionStart) +
            data +
            value.substring(selectionEnd);
        const newSelection = selectionStart + data.length;
        await changeAction(newValue, newSelection);
    }, [changeAction, value, maxLength]);

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

    // FIXME handle cut event
    return <div
        onBeforeInput={onBeforeInput}
        onPaste={onPaste} onKeyDown={onKeyDown}
         className="input" inputMode="text"
        tabIndex={0} contentEditable={true} suppressContentEditableWarning={true}
              >
             <TextNode ref={textRef} value={value}
               selectionStart={selectionStart ?? undefined}
        />
        </div>;
};
