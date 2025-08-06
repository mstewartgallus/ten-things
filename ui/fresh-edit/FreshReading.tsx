"use client";

import type { ReactNode, MouseEvent } from "react";
import type { Entry } from '@/lib';
import { useMemo, useId } from 'react';
import { FreshLayout } from "./FreshLayout";
import { useFresh } from "./FreshProvider";
import { Button } from "../button";
import { Icon } from "../icon";

import styles from "./FreshEdit.module.css";

interface ReadingProps {
    children?: ReactNode;
    disabled: boolean;
    entry?: Entry;
    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;
    completeAction?: () => Promise<void>;
}

export const FreshReading = ({
    entry,
    children,

    disabled,

    changeAction,
    toggleAction,
    completeAction
}: ReadingProps) => {
    const emptyValue = !entry;
    const value = entry && entry.value

    const onClick = useMemo(() => {
        if (!toggleAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await toggleAction();
        };
    }, [toggleAction]);

    const { controlId } = useFresh();
    const id = useId();
    return <FreshLayout
            titleButton={
                <Button aria-label={emptyValue ? 'Create Thing' : 'Edit Thing'}
                    disabled={disabled || !onClick}
                    onClick={onClick}
                    aria-expanded={false}
                    aria-controls={controlId}>
                    <Icon>{emptyValue ? '+' : '✎'}</Icon>
                </Button>
            }
            title={value ?? '...'}
            completeButton={
                completeAction
                    && <form id={id} action={completeAction}>
                        <Button disabled={disabled} aria-label="Complete Thing" value="complete">
                            <Icon>✔</Icon>
                        </Button>
                    </form>
            }>
            {children}
    </FreshLayout>;
};
