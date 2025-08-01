"use client";

import type {
    DetailedHTMLProps,
    HTMLAttributes,
    StrictMode, ReactNode, Ref, RefObject
} from "react";
import {
    createContext, useCallback,
    useContext, createElement, useEffect, useRef, useState
} from "react";
import { Portal } from "../Portal";
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

        customElements.whenDefined(name, () => {
            setDefined(true);
        });
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

interface TenConnectedEvent extends CustomEvent {
    detail: {
        internals: ElementInternals;
    }
    currentTarget: TenInputElement;
}

const filter = (value: string) => value === 'maxlength' ? 'maxLength' : value;

const getElement = async () => {
    class ImplTenConnectedEvent extends CustomEvent implements TenConnectedEvent {
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

        get form() { return this.internals.form; }
        get validity() { return this.internals.validity; }
        get validationMessage() { return this.internals.validationMessage; }
        get willValidate() { return this.internals.willValidate; }

        checkValidity() { return this.internals.checkValidity(); }
        reportValidity() { return this.internals.reportValidity(); }
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

    const ref = useRef<TenInputElement>(null);
    const internalsRef = useRef<ElementInternals>(null);
    const shadowRootRef = useRef<ShadowRoot>(null);

    const onTenConnected = useCallback((e: TenConnectedEvent) => {
        const elem = e.currentTarget;
        const internals = e.detail.internals;
        const shadowRoot = elem.attachShadow({ mode: 'closed' });

        internals.role = 'textbox';

        ref.current = elem;
        internalsRef.current = internals;
        shadowRootRef.current = shadowRoot;
        setAttached(true);
    }, []);

    return <ten-input {...props} onTenConnected={onTenConnected}>
        {
            attached &&
                <Portal domNode={shadowRootRef.current}>
                   <InputImpl {...props} internals={internalsRef.current} />
                </Portal>
        }
        </ten-input>;
};
