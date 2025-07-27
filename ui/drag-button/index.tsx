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

    readonly onDragStart?: () => void;
    readonly onDragEnd?: () => void;
}

export const DragButton = ({ children, dragging, onDragStart, onDragEnd }: Props) => {
    const onToggle = onDragStart || onDragEnd;

    const onClick = useMemo(() => {
        if (!onDragStart) {
            return;
        }
        return (e: MouseEvent<HTMLButtonElement>) => {
            if (e.button !== 0) {
                return;
            }
            e.preventDefault();
            onDragStart();
            console.log('dragstart');
        };
    }, [onDragStart]);

    const onPointerDown = useMemo(() => {
        if (!onDragStart) {
            return;
        }
        return (e: PointerEvent<HTMLButtonElement>) => {
            if (!e.isPrimary) {
                return;
            }
            (e.target as Element).releasePointerCapture(e.pointerId);
            onDragStart()
        };
    }, [onDragStart]);

    return <RawButton
                 aria-label="Reorder"
                 aria-expanded={dragging}
                 onPointerDown={onPointerDown}
                 onClick={onClick}
                 disabled={!onClick} >
                 {children}
    </RawButton>;
};
