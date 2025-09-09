'use client';

import type { JSX, MouseEvent, PointerEvent, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useWrap, toDataProps } from "../wrap";
import { useCursor } from "../UiProvider";
import { withClass } from "../with-class";

import styles from './DragButton.module.css';

export const RawButton =
    withClass<JSX.IntrinsicElements["button"]>(
        'button',
        styles.button);

interface Props {
    disabled: boolean;
    children?: ReactNode;
    dragging: boolean;

    dragStartAction?: () => Promise<void>;
    dragEndAction?: () => Promise<void>;
}

const DragButton = ({ disabled, children, dragging, dragStartAction, dragEndAction }: Readonly<Props>) => {
    const onClickDragEnd = useMemo(() => {
        if (!dragEndAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            if (e.button !== 0) {
                return;
            }
            console.log('drag end');
            e.preventDefault();
            await dragEndAction();
        };
    }, [dragEndAction]);

    const onClickDragStart = useMemo(() => {
        if (!dragStartAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            if (e.button !== 0) {
                return;
            }
            console.log('drag start');
            e.preventDefault();
            await dragStartAction();
        };
    }, [dragStartAction]);
    const onClick = dragging ? dragEndAction : dragStartAction;

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
    const onPointerLeave = useCallback(() => {
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
                 onPointerLeave={onPointerLeave}
                 onClick={onClick} {...toDataProps(state)}>
                 {children}
            </RawButton>
        </div>;
};

export default DragButton;
