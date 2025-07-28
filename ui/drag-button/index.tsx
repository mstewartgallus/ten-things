'use client';

import type { JSX, MouseEvent, PointerEvent, ReactNode } from 'react';
import { useMemo } from 'react';
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

    useCursor(dragging ? 'grabbing' : undefined);

    const { state, cb } = useWrap();
    return <div className={styles.buttonWrapper} {...cb}>
            <RawButton
                 disabled={disabled}
                 aria-label="Reorder"
                 aria-expanded={dragging}
                 onPointerDown={onPointerDown}
                 onClick={onClick} {...toDataProps(state)}>
                 {children}
            </RawButton>
        </div>;
};
