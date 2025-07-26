'use client';

import type { Key, ReactNode, Ref } from 'react';
import { createContext, useCallback, useContext, useImperativeHandle, useMemo, useState } from 'react';
import { useIsPrimaryPointerDown } from "../html";
import { useItem } from "../list";
import { useCursor } from "../UiProvider";

interface ListContext {
    readonly dragIndex?: number;
    readonly onDragStart?: (index: number) => void;
    readonly onDrop?: (index: number) => void;
};

const ListContext = createContext<ListContext>({
});
ListContext.displayName = 'ListContext';

export interface DndItemHandle {
    drag(): void;
    drop(): void;
}

export const useDndItem = (ref: Ref<DndItemHandle>) => {
    const index = useItem();
    const { dragIndex, onDragStart, onDrop } = useContext(ListContext);

    useImperativeHandle(ref, () => ({
        drag: () => {
            onDragStart && onDragStart(index);
        },
        drop: () => {
            onDrop && onDrop(index);
        }
    }), [onDragStart, onDrop]);
    return dragIndex;
};

interface Props {
    children: ReactNode;
    onSwapIndices?: (dragIndex: number, dropIndex: number) => void;
}

export const DndList = ({ children, onSwapIndices }: Props) => {
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    const isPrimaryPointerDown = useIsPrimaryPointerDown();

    if (!isPrimaryPointerDown && dragIndex !== null) {
        setDragIndex(null);
    }

    const onDragStart = useCallback((index: number) => {
            setDragIndex(index);
    }, []);
    let onDrop = useMemo(() => {
        if (!onSwapIndices) {
            return;
        }
        if (!dragIndex) {
            return;
        }
        return (index: number) => {
            onSwapIndices(dragIndex, index);
            setDragIndex(null);
        };
    }, [dragIndex, onSwapIndices]);

    if (dragIndex === null) {
        onDrop = undefined;
    }

    useCursor(dragIndex !== null ? 'grabbing' : undefined);

    const context = useMemo(() => ({
        dragIndex: dragIndex ?? undefined,
        onDragStart,
        onDrop
    }), [dragIndex, onDragStart, onDrop]);
    return <ListContext value={context}>
        {children}
    </ListContext>;
};
