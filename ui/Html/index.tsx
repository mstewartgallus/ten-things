'use client';

import type {
    JSX,
    Ref, PointerEvent
} from "react";

import {
    createContext, useCallback, useContext, useMemo, useEffect,
    useImperativeHandle,
    useState
} from "react";

import styles from "./Html.module.css";

export type Cursor = 'grabbing';

const HtmlContext = createContext<boolean>(false);

export const useIsPrimaryPointerDown = () => useContext(HtmlContext);

export interface HtmlHandle {
    cursor(cursor?: Cursor): void;
}

type Props = Omit<JSX.IntrinsicElements['html'], "ref"> & {
    ref: Ref<HtmlHandle>;
};

const Html = ({ ref, children, ...props }: Props) => {
    const [isPrimaryPointerDown, setIsPrimaryPointerDown] = useState(false);
    const [cursor, setCursor] = useState<Cursor | null>(null);

    useImperativeHandle(ref, () => ({
        cursor: (cursor?: Cursor) => {
            setCursor(() => cursor ?? null);
        }
    }), []);

    const onPointerDown = useCallback((e: PointerEvent<HTMLHtmlElement>) => {
        if (!e.isPrimary) {
            return;
        }
        setIsPrimaryPointerDown(true);
    }, []);
    const onPointerUp = useCallback((e: PointerEvent<HTMLHtmlElement>) => {
        if (!e.isPrimary) {
            return;
        }
        setIsPrimaryPointerDown(false);
    }, []);

    return <html className={styles.html}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown} onPointerLeave={onPointerDown}
    data-cursor={cursor} {...props}>
           <HtmlContext value={isPrimaryPointerDown}>
              {children}
           </HtmlContext>
        </html>;
};

export default Html;
