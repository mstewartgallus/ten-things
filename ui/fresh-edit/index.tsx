"use client";

import type { ReactNode, Ref, InputEvent, FormEvent, JSX, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { Button } from "../button";
import { Time } from "../time";
import { Icon } from "../icon";
import { Input } from "../input";

import styles from "./FreshEdit.module.css";

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

interface Props {
    listItemMarker: ReactNode;
    children?: ReactNode;

    disabled: boolean;

    entry?: Entry;

    selected: boolean;

    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;

    completeAction?: () => Promise<void>;
}

export const FreshEdit = ({
    listItemMarker,
    children,

    disabled,

    entry,
    selected,

    changeAction,
    toggleAction,

    completeAction
}: Props) => {
    const value = entry && entry.value;
    const created = entry && entry.created;
    const emptyValue = value === undefined;

    const [, startTransition] = useTransition();

    const onClick = useMemo(() => {
        if (!toggleAction) {
            return;
        }
        return async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            await toggleAction();
        };
    }, [toggleAction]);

    const [focus, setFocus] = useState(false);

    const formAction = useMemo(() => {
        if (!changeAction) {
            return;
        }
        return async (d: FormData) => {
            // FIXME verify
            const title = d.get('title') as string;
            await changeAction(title);
        };
    }, [changeAction]);

    const onFocus = useCallback(() => startTransition(() => setFocus(true)), []);
    const onBlur = useCallback(() => startTransition(() => setFocus(false)), []);

    const controlId = useId();
    const formId = useId();
    const id = useId();

    const label = emptyValue ?
        (selected ? 'Cancel Create' : 'Create Thing') :
        (selected ? 'Cancel Edit' : 'Edit Thing');

    const disclosureButton = <Button aria-label={label}
        disabled={disabled || !onClick}
        onClick={onClick}
        aria-expanded={selected}
        aria-controls={controlId}>
            <Icon>{selected ? '🗙' : emptyValue ? '+' : '✎'}</Icon>
        </Button>;
    const disclosure = selected
        ? <form id={formId} action={formAction} className={styles.inputForm}>
           <Input name="title" value={value} maxLength={300} required
               onFocus={onFocus} onBlur={onBlur}
               className={styles.input} aria-label="title" data-selected={selected}
            />
          </form>
        : <div className={styles.input}>{value ?? '...'}</div>;

    const completeButton = selected
        ? <Button form={formId} disabled={disabled} aria-label="Edit Thing">
              <Icon>D</Icon>
          </Button>
        : completeAction
        && <form id={id} action={completeAction}>
            <Button disabled={disabled || selected} aria-label="Complete Thing" value="complete">
                <Icon>✔</Icon>
            </Button>
        </form>;

    return <div className={styles.item}>
            <div className={styles.marker}>{listItemMarker}</div>

            <div className={styles.freshItem} data-focus={focus}>
                <div className={styles.inputWrapper}>
                    <div className={styles.disclosureButton}>
                        {disclosureButton}
                    </div>

                    <div id={controlId}>
                        {disclosure}
                    </div>
                </div>
            </div>

            <div className={styles.widgets}>
                {completeButton}
            </div>

            <div className={styles.metadata}>
                {children}
            </div>
        </div>;
};
