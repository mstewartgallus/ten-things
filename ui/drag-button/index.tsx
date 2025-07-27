'use client';

import type { JSX, MouseEvent, PointerEvent, ReactNode } from 'react';
import { useMemo } from 'react';
import { withClass } from "../with-class";

import styles from './DragButton.module.css';

export const RawButton =
    withClass<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
        'button',
        styles.button);

interface Props {
    readonly children?: ReactNode;
    readonly dragging: boolean;

    readonly dragStartAction?: () => Promise<void>;
}

export const DragButton = ({ children, dragging, dragStartAction }: Props) => {
    const action = useMemo(() => {
        if (!dragStartAction) {
            return;
        }
        return async () => {
            await dragStartAction();
        };
    }, [dragStartAction]);

    const onPointerDown = useMemo(() => {
        if (!dragStartAction) {
            return;
        }
        return async (e: PointerEvent<HTMLButtonElement>) => {
            if (!e.isPrimary) {
                return;
            }
            (e.target as Element).releasePointerCapture(e.pointerId);
            await dragStartAction()
        };
    }, [dragStartAction]);

    return <RawButton
                 aria-label="Reorder"
                 aria-expanded={dragging}
                 onPointerDown={onPointerDown}
                 formAction={action}
                 disabled={!action} >
                 {children}
    </RawButton>;
};
