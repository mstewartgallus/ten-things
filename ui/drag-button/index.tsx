'use client';

import type { JSX, MouseEvent, PointerEvent, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useWrap, toDataProps } from "../wrap";
import { useCursor } from "../UiProvider";
import { withClass } from "../with-class";

import styles from './DragButton.module.css';

export const RawButton =
    withClass<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
        'button',
        styles.button);

interface Props {
    disabled: boolean;
    readonly children?: ReactNode;
    readonly dragging: boolean;

    readonly dragStartAction?: () => Promise<void>;
}

export const DragButton = ({ disabled, children, dragging, dragStartAction }: Props) => {
    const onClick = useMemo(() => {
        if (!dragStartAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            if (e.button !== 0) {
                return;
            }
            e.preventDefault();
            await dragStartAction();
        };
    }, [dragStartAction]);

    const [pointerDown, setPointerDown] = useState(false);
    const onPointerDown = useCallback((e: PointerEvent<HTMLButtonElement>) => {
        if (!e.isPrimary) {
            return;
        }
        setPointerDown(true);
    }, []);
    const onPointerUp = useCallback((e: PointerEvent<HTMLButtonElement>) => {
        if (!e.isPrimary) {
            return;
        }
        setPointerDown(false);
    }, []);

    const onPointerMove = useMemo(() => {
        if (!pointerDown || !dragStartAction) {
            return;
        }
        return async (e: PointerEvent<HTMLButtonElement>) => {
            if (!e.isPrimary) {
                return;
            }
            (e.target as Element).releasePointerCapture(e.pointerId);
            await dragStartAction();
        };
    }, [pointerDown, dragStartAction]);

    useCursor(dragging ? 'grabbing' : undefined);

    const { state, cb } = useWrap();
    return <div className={styles.buttonWrapper} {...cb}>
            <RawButton
                 disabled={disabled}
                 aria-label="Reorder"
                 aria-expanded={dragging}
                 onPointerMove={onPointerMove}
                 onPointerDown={onPointerDown}
                 onPointerUp={onPointerUp}
                 onClick={onClick} {...toDataProps(state)}>
                 {children}
            </RawButton>
        </div>;
};
