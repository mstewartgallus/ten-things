'use client';

import type { Key, ReactNode, Ref } from 'react';
import { createContext, useCallback, useContext, useImperativeHandle, useMemo, useState } from 'react';
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

export interface DndListHandle {
    dragEnd(): void;
}

export interface DndItemHandle {
    dragStart(): void;
    drop(): void;
}

export const useDndItem = (ref: Ref<DndItemHandle>) => {
    const index = useItem();
    const { dragIndex, onDragStart, onDrop } = useContext(ListContext);

    useImperativeHandle(ref, () => ({
        dragStart: () => {
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
    ref: Ref<DndListHandle>;
    onSwapIndices?: (dragIndex: number, dropIndex: number) => void;
}

export const DndList = ({ ref, children, onSwapIndices }: Props) => {
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
        dragEnd: () => {
            setDragIndex(null);
        }
    }), []);

    const onDragStart = useMemo(() => {
        if (dragIndex !== null) {
            return;
        }
        return (index: number) => {
            setDragIndex(index);
        };
    }, []);
    const onDrop = useMemo(() => {
        if (!onSwapIndices) {
            return;
        }
        if (dragIndex === null) {
            return;
        }
        return (index: number) => {
            onSwapIndices(dragIndex, index);
            setDragIndex(null);
        };
    }, [dragIndex, onSwapIndices]);

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
