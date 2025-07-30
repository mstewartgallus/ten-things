"use client";

import type {
    DetailedHTMLProps,
    HTMLAttributes,
    StrictMode, ReactNode, Ref, RefObject
} from "react";
import { createContext, useContext, createElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { InputImpl, InputInternalsProvider } from "./InputImpl";

interface CustomConstructor {
    new (): HTMLElement;
}

const useCustomElement = (name: string, getCustomElement: () => Promise<CustomConstructor>) => {
    useEffect(() => {
        (async () => {
            const custom = await getCustomElement();
            if (customElements.get(name)) {
                return;
            }
            customElements.define(name, custom);
        })();
    }, [getCustomElement]);
};

export interface TenInputElement extends HTMLElement {
    createPortal(node: ReactNode): ReactNode;
}

const styleSheetSrc = `
.input {
    all: unset;

    display: block;
    min-block-size: var(--line);
    caret-color: var(--highlight-text);
    cursor: text;
}
`;

const filter = (value: string) => value === 'maxlength' ? 'maxLength' : value;

const getElement = async () => {
    const styleSheet = new CSSStyleSheet();
    await styleSheet.replace(styleSheetSrc);

    return class ImplTenInputElement extends HTMLElement implements TenInputElement {
        static formAssociated = true;
        static observedAttributes = ['name', 'value', 'maxlength', 'required'];

        #internals: ElementInternals;
        #root: HTMLElement | null = null;

        constructor() {
            super();
            this.#internals = this.attachInternals();
        }

        connectedCallback() {
            // Insert into the slot as default to implement flicker
            // free rendering
            const shadowRoot = this.attachShadow({ mode: 'closed' });
            const slot = document.createElement('slot');
            shadowRoot.appendChild(slot);
            shadowRoot.adoptedStyleSheets.push(styleSheet);
            this.#root = slot;
        }

        disconnectedCallback() {
            this.#root = null;
        }

        createPortal(node: ReactNode) {
            const root = this.#root;
            if (!root) {
                return;
            }
            return createPortal(
                <InputInternalsProvider internals={this.#internals}>
                    {node}
                </InputInternalsProvider>,
                root);
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

const InputContext = createContext<TenInputElement | null>(null);
InputContext.displayName = `InputContext`;

type Props =
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
& {
    name?: string;
    value?: string;
    maxLength?: number;
    required?: boolean;

    className?: string;
    "aria-label"?: string;
}

const Inner = (props: Props) => {
    const inputElement = useContext(InputContext);
    if (!inputElement) {
        throw Error("no input element context");
    }

    const [mounted, setMounted] = useState<boolean>(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return <>
        { inputElement.createPortal(<InputImpl {...props} />) }
        { !mounted && props.value}
    </>;
};

export const Input = (props: Props) => {
    useCustomElement('ten-input', getElement);

    const [mounted, setMounted] = useState<boolean>(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const ref = useRef<TenInputElement>(null);
    return createElement('ten-input', {
        ...props,
        ref,
        children: mounted
            ? <InputContext value={ref.current!}><Inner {...props} /></InputContext>
            : props.value
    });
};
