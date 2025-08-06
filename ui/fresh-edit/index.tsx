"use client";

import type { ReactNode, Ref, ClipboardEvent, KeyboardEvent, InputEvent, FormEvent, JSX, MouseEvent } from "react";
import type { Entry } from '@/lib';
import {
    createContext, useContext,
    useTransition, useCallback, useImperativeHandle, useMemo,
    useId, useRef, useState, useEffect
} from 'react';
import { FreshProvider } from "./FreshProvider";
import { FreshEditing } from "./FreshEditing";
import { FreshReading } from "./FreshReading";
import { Time } from "../time";

interface ViewProps {
    children: ReactNode;
    selected: boolean;
    disabled: boolean;
    entry?: Entry;
    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;
    completeAction?: () => Promise<void>;
}

const FreshView = (props: ViewProps) => {
    const { selected, ...leftover } = props;
    return selected
        ? <FreshEditing {...leftover} maxLength={300} />
        : <FreshReading {...leftover} />;
};

interface Props {
    selected: boolean;
    disabled: boolean;
    entry?: Entry;
    changeAction?: (value: string) => Promise<void>;
    toggleAction?: () => Promise<void>;
    completeAction?: () => Promise<void>;
}

export const FreshEdit = (props: Props) => {
    const created = props.entry && props.entry.created;

     return <FreshProvider>
            <FreshView {...props}>
        {
            created && <>Created: <Time>{created}</Time></>
        }
            </FreshView>
         </FreshProvider>;
};
