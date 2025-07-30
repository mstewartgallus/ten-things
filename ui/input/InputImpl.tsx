"use client";

import type { ReactNode, Ref, KeyEvent, InputEvent } from "react";
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

type SelectionDirection = 'none' | 'forward' | 'backward';

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

    const onKeyDown = useCallback((e: KeyEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();

        const { form } = internals;
        if (!form) {
            return;
        }

        form.requestSubmit();
    }, [internals, maxLength]);

    // FIXME handle copy/pasting, etc...
    const contentRef = useRef<HTMLDivElement>(null);

    const onBeforeInput = useCallback((e: InputEvent<HTMLDivElement>) => {
        const data = e.data;

        if (data.includes('\n')) {
            e.preventDefault();
            return;
        }

        if (value.length + data.length >= maxLength) {
            e.preventDefault();
            return;
        }

        setValue(contentRef.current!.textContent);
    }, [value, maxLength]);

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
        contentRef.current!.textContent = initValue ?? '';
    }, [initValue]);

    // FIXME handle paste event
    return <div ref={contentRef} contentEditable={true} className="input" inputMode="text"
        onKeyDown={onKeyDown} onBeforeInput={onBeforeInput} />;
};
