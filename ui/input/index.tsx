"use client";

import type {
    JSX,
    DetailedHTMLProps,
    HTMLAttributes,
    StrictMode, ReactNode, Ref, RefObject
} from "react";
import {
    createContext, useCallback,
    useContext, createElement, useEffect, useRef, useState,
    startTransition
} from "react";
import { createPortal } from "react-dom";
import { InputImpl } from "./InputImpl";

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


export interface TenInputElement extends HTMLElement {
}

interface TenConnectedEvent extends CustomEvent<{ internals: ElementInternals }> {
}

interface TenInputElementAttributes extends HTMLAttributes<TenInputElement> {
    onTenConnected?: (event: TenConnectedEvent) => void;
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
    class ImplTenConnectedEvent extends CustomEvent<{ internals: ElementInternals }> implements TenConnectedEvent {
        constructor(internals: ElementInternals) {
            super('TenConnected', { detail: { internals } });
        }
    }

    return class ImplTenInputElement extends HTMLElement implements TenInputElement {
        static formAssociated = true;
        static observedAttributes = ['name', 'value', 'maxlength', 'required'];

        #internals: ElementInternals;

        constructor() {
            super();
            this.#internals = this.attachInternals();
        }

        connectedCallback() {
            // FIXME... not sure this is quite right
            queueMicrotask(() => {
                this.dispatchEvent(new ImplTenConnectedEvent(this.#internals));
            });
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

        get form() { return this.#internals.form; }
        get validity() { return this.#internals.validity; }
        get validationMessage() { return this.#internals.validationMessage; }
        get willValidate() { return this.#internals.willValidate; }

        checkValidity() { return this.#internals.checkValidity(); }
        reportValidity() { return this.#internals.reportValidity(); }
    };
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
    const shadowRootRef = useRef<ShadowRoot>(null);

    const onTenConnected = useCallback((e: TenConnectedEvent) => {
        const internals = e.detail.internals;
        internals.role = 'textbox';
        internalsRef.current = internals;
        startTransition(() => setConnected(true));
    }, []);

    useEffect(() => {
        if (!connected) {
            return;
        }
        const shadowRoot = ref.current!.attachShadow({ mode: 'closed' });
        shadowRootRef.current = shadowRoot;
        startTransition(() => setAttached(true));
    }, [connected]);

    const [value, setValue] = useState(props.value);
    const [selectionStart, setSelectionStart] = useState<number | null>(null);
    const changeAction = useCallback(async (value: string, selectionStart: number) => {
        setValue(value);
        setSelectionStart(selectionStart);
    }, []);

    return <ten-input {...props} value={value} ref={ref} onTenConnected={onTenConnected}>
        {
            attached &&
                createPortal(
                    <InputImpl {...props} value={value} selectionStart={selectionStart ?? undefined} internals={internalsRef.current!} changeAction={changeAction} />,
                    shadowRootRef.current!)
        }
    </ten-input>;
};
