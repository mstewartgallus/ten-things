'use client';

import type { ReactNode, Ref } from 'react';
import type { Id, Fresh } from "@/lib";
import { createContext, useContext, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { List, useItem } from '../list';

export interface FreshItemHandle {
    dragStart(): void;
    drop(): void;

    select(): void;

    change(value: string): void;
    create(): void;
    complete(): void;
}

export interface FreshListHandle {
    dragEnd(): void;
}

interface Context {
    fresh: readonly (Fresh | null)[];

    selectionIndex?: number;
    onSelectIndex?: (index: number) => void;

    dragIndex?: number;
    onDragStartIndex?: (index: number) => void;
    onDropIndex?: (index: number) => void;
    onChangeId?: (id: Id, value: string) => void;
    onCreateIndex?: (index: number) => void;
    onCompleteIndex?: (index: number) => void;
}

const FreshContext = createContext<Context>({
    fresh: []
});

export const useFreshItem = (ref: Ref<FreshItemHandle>) => {
    const {
        fresh,
        selectionIndex,
        dragIndex,
        onDragStartIndex,
        onDropIndex,
        onSelectIndex,
        onChangeId,
        onCreateIndex, onCompleteIndex
    } = useContext(FreshContext);

    const index = useItem();

    const item = fresh[index];
    const id = item && item.id;

    useImperativeHandle(ref, () => ({
        select: onSelectIndex ? () => onSelectIndex(index) : () => {},

        dragStart: () => onDragStartIndex && onDragStartIndex(index),
        drop: () => onDropIndex && onDropIndex(index),

        change: (value: string) => {
            onChangeId && id &&
                onChangeId(id, value);
        },
        create: () => {
            onCreateIndex &&
                onCreateIndex(index);
        },
        complete: () => {
            onCompleteIndex &&
                onCompleteIndex(index);
        },
    }), [id, index, onSelectIndex, onDragStartIndex, onChangeId, onCreateIndex, onCompleteIndex]);

    return { index, dragIndex, selectionIndex, item };
};

interface Props {
    children: ReactNode;
    fresh: readonly (Fresh | null)[];

    selectionIndex?: number;
    dragIndex?: number;

    onSelectIndex?: (index: number) => void;

    onCreateIndex?: (index: number) => void;
    onCompleteIndex?: (index: number) => void;

    onDragStartIndex?: (index: number) => void;
    onDropIndex?: (index: number) => void;

    onChangeId?: (id: Id, value: string) => void;
}

export const FreshList = ({
    children, fresh,
    selectionIndex,
    dragIndex,
    onDragStartIndex, onDropIndex,
    onChangeId,
    onSelectIndex,
    onCreateIndex, onCompleteIndex
}: Props) => {
    const keyAt = useCallback((index: number) => {
        const item = fresh[index];
        return item ? `id-${item.id}` : `indx-${index}`;
    }, [fresh]);

    const context = useMemo(() => ({
        fresh,
        selectionIndex,
        dragIndex,
        onDragStartIndex,
        onDropIndex,
        onSelectIndex,
        onChangeId,
        onCreateIndex,
        onCompleteIndex
    }), [fresh, selectionIndex, dragIndex, onDragStartIndex, onDropIndex,
         onSelectIndex, onChangeId, onCreateIndex, onCompleteIndex]);

    return <FreshContext value={context}>
        <List keyAt={keyAt} length={fresh.length}>
           {children}
         </List>
        </FreshContext>;
};
