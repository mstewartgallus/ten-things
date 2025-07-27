'use client';

import type { PointerEvent, Ref, RefObject } from "react";
import {
    useImperativeHandle,
    useTransition, useCallback, useMemo, useState
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

export interface WrapHandle {
    pointerEnter(): void;
    pointerLeave(): void;

    pointerDown(): void;
    pointerUp(): void;
}

// FIXME this is silly
export const useWrapCallbacks = (ref: RefObject<WrapHandle | null>) => {
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
    return { onPointerEnter, onPointerLeave, onPointerDown, onPointerUp };
};

export const useWrap: (ref: Ref<WrapHandle>) => Wrap = (ref: Ref<WrapHandle>) => {
    const [, startTransition] = useTransition();
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);

    if (!hover && active) {
        startTransition(() => setActive(false));
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
