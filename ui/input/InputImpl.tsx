"use client";

import type { ReactNode, Ref, InputEvent } from "react";
import {
    createContext,
    useContext,
    useEffect,
    useCallback, useMemo, useRef, useState
} from "react";

const InputInternalsContext = createContext<ElementInternals | null>(null);

export const InputInternalsProvider = ({ children, internals }: {
    children: ReactNode,
    internals: ElementInternals
}) =>
    <InputInternalsContext value={internals}>{children}</InputInternalsContext>;

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
    const internals = useContext(InputInternalsContext);
    if (!internals) {
        throw Error("no internals");
    }

    const [name, setName] = useState<string | null>(initName ?? null);
    const [value, setValue] = useState<string | null>(initValue ?? null);
    const [maxLength, setMaxLength] = useState<number | null>(initMaxLength ?? null);

    const contentRef = useRef<HTMLDivElement>(null);
    const onInput = useCallback(async (e: InputEvent<HTMLDivElement>) => {
        const text = contentRef.current!.innerText;
        setValue(text);
    }, []);

    useEffect(() => {
        internals.role = 'textbox';
    }, [internals]);

    useEffect(() => {
        internals.role = 'textbox';
        internals.ariaRequired = required.toString();
    }, [internals, required]);

    useEffect(() => {
        internals.setFormValue(value ?? '');
    }, [internals, value]);

    useEffect(() => {
        const flags: ValidityStateFlags = {};
        const messages = [];

        const { length } = value ?? '';
        if (maxLength !== null && length >= maxLength) {
            flags.tooLong = true;
            messages.push(`${length} >= ${maxLength}`);
        }
        // FIXME anchor?
        internals.setValidity(flags, messages.join('\n'));
    }, [internals, value, maxLength]);

    useEffect(() => {
        const newValue = value ?? '';

        const oldValue = contentRef.current!.innerText;
        if (oldValue === newValue) {
            return;
        }
        // FIXME preserve cursor
        contentRef.current!.innerText = newValue;
    }, [value]);

    return <div ref={contentRef} contentEditable={true} onInput={onInput} className="input" />;
};
