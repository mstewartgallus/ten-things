"use client";

import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { useMemo } from 'react';
import type { WrapHandle } from "../wrap";
import { useRef } from "react";
import { useWrapCallbacks, useWrap, toDataProps } from "../wrap";

import styles from './DropButton.module.css';

interface Props {
    readonly children?: ReactNode;
    readonly action?: () => Promise<void>;
}

export const DropButton = ({ children, action }: Props) => {
    const ref = useRef<WrapHandle>(null);
    const state = useWrap(ref);
    const cb = useWrapCallbacks(ref);

    const onPointerUp = useMemo(() => {
        if (!action) {
            return;
        }

        return async (e: PointerEvent<HTMLButtonElement>) => {
            if (!e.isPrimary) {
                return;
            }
            await action();
        };
    }, [action]);

    const clickAction = useMemo(() => {
        if (!action) {
            return;
        }

        return async () => {
            await action();
        };
    }, [action]);

    return <div className={styles.wrapper} {...cb}>
            <button className={styles.dropZone} {...toDataProps(state)}
                onPointerUp={onPointerUp}
                formAction={clickAction}
                disabled={!action ? true : undefined}>
                {children}
            </button>
        </div>;

};
