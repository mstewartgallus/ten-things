"use client";

import type {
    JSX,
    DetailedHTMLProps,
    HTMLAttributes,
    StrictMode, ReactNode, Ref, RefObject,
    KeyboardEvent, InputEvent, ClipboardEvent
} from "react";
import {
    createContext, useCallback,
    useContext, createElement, useMemo, useEffect, useRef, useState,
    startTransition
} from "react";
import { createPortal } from "react-dom";
import { TenInputElement, InputImpl } from "./InputImpl";
import styles from "./Input.module.css";

interface CustomConstructor {
    new (): HTMLElement;
}

const useCustomElement = (name: string, getCustomElement: () => Promise<CustomConstructor>) => {
    const [defined, setDefined] = useState(false);

    useEffect(() => {
        if (defined) {
            return;
        }

        if (customElements.get(name)) {
            return;
        }

        (async () => {
            await customElements.whenDefined(name);
            setDefined(true);
        })();
    }, [defined]);

    useEffect(() => {
        if (defined) {
            return;
        }

        (async () => {
            const custom = await getCustomElement();
            if (customElements.get(name)) {
                return;
            }
            customElements.define(name, custom);
        })();
    }, [defined, getCustomElement]);

    return defined;
};

interface TenInputElementAttributes extends HTMLAttributes<TenInputElement> {
    value?: string;
}

// FIXME...
type OldIntrinsicElements = JSX.IntrinsicElements;
declare namespace React {
    namespace JSX {
        interface IntrinsicElements extends OldIntrinsicElements {
            'ten-input': DetailedHTMLProps<TenInputElementAttributes, TenInputElement>;
        }
    }
}

const filter = (value: string) => value === 'maxlength' ? 'maxLength' : value;

const getElement = async () => {
    return class ImplTenInputElement extends HTMLElement implements TenInputElement {
        static formAssociated = true;
        static observedAttributes = ['name', 'value', 'maxlength', 'required'];

        internals: ElementInternals;

        constructor() {
            super();
            this.internals = this.attachInternals();
        }

        set name(v: string | null) {
            if (v) {
                this.setAttribute('name', v);
            } else {
                this.removeAttribute('name');
            }

        }
        set value(v: string | null) {
            if (v) {
                this.setAttribute('value', v);
            } else {
                this.removeAttribute('value');
            }
        }

        set maxLength(v: number | null) {
            if (v) {
                this.setAttribute('maxlength', v.toString());
            } else {
                this.removeAttribute('maxlength');
            }
        }

        // get required() { return this.getAttribute('required'); }
        get name() { return this.getAttribute('name'); }
        get value() { return this.getAttribute('value'); }
        get maxLength() {
            const attr = this.getAttribute('maxlength');
            if (!attr) {
                return null;
            }
            return parseInt(attr);
        }

        get form() { return this.internals.form; }
        get validity() { return this.internals.validity; }
        get validationMessage() { return this.internals.validationMessage; }
        get willValidate() { return this.internals.willValidate; }

        checkValidity() { return this.internals.checkValidity(); }
        reportValidity() { return this.internals.reportValidity(); }
    };
};

// FIXME.. do something better
declare global {
    interface ShadowRoot {
        getSelection?: () => Selection;
    }
}
const getCaret = (shadowRoot: ShadowRoot) => {
    if (shadowRoot.getSelection) {
        const range = shadowRoot.getSelection().getRangeAt(0);
        return [range.startOffset, range.endOffset];
    }
    throw Error("no shadowroot selection method");
};

type Props =
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
& {
    name?: string;
    value?: string;
    maxLength?: number;
    required?: boolean;

    className?: string;
    "aria-label"?: string;

    "data-selected"?: boolean;
}

export const Input = (props: Props) => {
    useCustomElement('ten-input', getElement);

    const [attached, setAttached] = useState(false);
    const [connected, setConnected] = useState(false);

    const ref = useRef<TenInputElement>(null);
    const internalsRef = useRef<ElementInternals>(null);

    useEffect(() => {
        const elem = ref.current!;
        if (elem.shadowRoot) {
            return;
        }
        elem.attachShadow({ mode: 'open' });
        startTransition(() => setAttached(true));
    }, []);

    const [value, setValue] = useState(props.value ?? '');
    const [selectionStart, setSelectionStart] = useState<number | null>(null);
    const changeAction = useCallback(async (value: string, selectionStart: number) => {
        setValue(value);
        setSelectionStart(selectionStart);
    }, []);

    const backspaceAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async () => {
            // FIXME set selectionStart as a property of the element
            let [selectionStart, selectionEnd] = getCaret(ref.current!.shadowRoot!);
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
            let [selectionStart, selectionEnd] = getCaret(ref.current!.shadowRoot!);
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

            const [selectionStart, selectionEnd] = getCaret(ref.current!.shadowRoot!);
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
        return (e: InputEvent<TenInputElement>) => {
            e.preventDefault();
            inputAction(e.data);
        };
    }, [inputAction]);

    const onPaste = useMemo(() => {
        if (!inputAction) {
            return;
        }

        return (e: ClipboardEvent<TenInputElement>) => {
            e.preventDefault();
            inputAction(e.clipboardData.getData('text'));
        };
    }, [inputAction]);

    // FIXME handle deletion better, also cut
    const onKeyDown = useCallback((e: KeyboardEvent<TenInputElement>) => {
        const { key } = e;
        if (key !== 'Enter' && key !== 'Backspace' && key !== 'Delete') {
            return;
        }
        e.preventDefault();

        switch (key) {
            case 'Enter':
                const { form } = ref.current!;
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
    }, [backspaceAction, deleteAction]);

    const getInternals = useCallback(() => ref.current!.internals, []);
    const dispatchEvent = useCallback(
        (e: Event) => {
            return ref.current!.dispatchEvent(e);
        }, []);

    return <ten-input {...props} value={value} ref={ref} className={styles.input}
            onBeforeInput={onBeforeInput} onKeyDown={onKeyDown} onPaste={onPaste}
        >
        {
            attached &&
                createPortal(
                    <InputImpl {...props} value={value} selectionStart={selectionStart ?? undefined}
                    dispatchEvent={dispatchEvent}
                    getInternals={getInternals} changeAction={changeAction} />,
                    ref.current!.shadowRoot!)
        }
    </ten-input>;
};
