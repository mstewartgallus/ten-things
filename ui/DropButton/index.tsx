"use client";

import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { useMemo } from 'react';
import { useWrap, toDataProps } from "../wrap";

import styles from './DropButton.module.css';

interface Props {
    readonly children?: ReactNode;
    readonly action?: () => Promise<void>;
}

const DropButton = ({ children, action }: Props) => {
    const { state, cb } = useWrap();

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

    const onClick = useMemo(() => {
        if (!action) {
            return;
        }

        return async (e: MouseEvent<HTMLButtonElement>) => {
            if (e.button !== 0) {
                return;
            }
            e.preventDefault();
            await action();
        };
    }, [action]);

    return <div className={styles.wrapper} {...cb}>
            <button className={styles.dropZone} {...toDataProps(state)}
                onPointerUp={onPointerUp}
                onClick={onClick}
                disabled={!onClick ? true : undefined}>
                {children}
            </button>
        </div>;

};

export default DropButton;
