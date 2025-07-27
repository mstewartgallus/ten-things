'use client';

import type { PointerEvent, Ref } from "react";
import {
    useImperativeHandle,
    useTransition, useCallback, useMemo, useRef, useState
} from "react";

interface Wrap {
    hover: boolean;
    active: boolean;
}

interface DataProps {
    "data-hover"?: string;
    "data-active"?: string;
}

export const toDataProps: (props: Wrap) => DataProps = ({ hover, active }) => ({
    "data-hover": hover ? "data-hover" : undefined,
    "data-active": active ? "data-active" : undefined
});

interface WrapHandle {
    pointerEnter(): void;
    pointerLeave(): void;

    pointerDown(): void;
    pointerUp(): void;
}

const useWrapState: (ref: Ref<WrapHandle>) => Wrap = (ref: Ref<WrapHandle>) => {
    const [, startTransition] = useTransition();
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);

    if (!hover && active) {
        setActive(false);
    }

    useImperativeHandle(ref, () => ({
        pointerEnter: () => startTransition(() => setHover(true)),
        pointerLeave: () => startTransition(() => setHover(false)),

        pointerDown: () => startTransition(() => setActive(true)),
        pointerUp: () => startTransition(() => setActive(false)),
    }), []);

    return useMemo(() => ({
        hover, active
    }), [hover, active]);
};

export const useWrap = () => {
    const ref = useRef<WrapHandle>(null);
    const state = useWrapState(ref);

    const onPointerEnter = useCallback(() => ref.current!.pointerEnter(), []);
    const onPointerLeave = useCallback(() => ref.current!.pointerLeave(), []);

    const onPointerDown = useCallback((e: PointerEvent) => {
        if (!e.isPrimary) {
            return;
        }
        ref.current!.pointerDown();
    }, []);
    const onPointerUp = useCallback((e: PointerEvent) => {
        if (!e.isPrimary) {
            return;
        }
        ref.current!.pointerUp();
    }, []);

    return {
        state,
        cb: { onPointerEnter, onPointerLeave, onPointerDown, onPointerUp }
    };
};
