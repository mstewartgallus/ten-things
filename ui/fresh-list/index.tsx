'use client';

import type { ReactNode, Ref } from 'react';
import type { Id, Fresh } from "@/lib";
import type { DndItemHandle } from '../dnd-list';
import type { SelectionListHandle, SelectionItemHandle } from '../selection-list';
import { createContext, useContext, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { List, useItem } from '../list';
import { SelectionList, useSelectionItem } from '../selection-list';
import { DndList, useDndItem } from '../dnd-list';

export interface FreshItemHandle {
    drag(): void;
    drop(): void;

    select(): void;

    change(value: string): void;
    create(): void;
    complete(): void;
}

export interface FreshListHandle {
    deselect(): void;
}

interface Context {
    onChangeId?: (id: Id, value: string) => void;
    onCreateIndex?: (index: number) => void;
    onCompleteIndex?: (index: number) => void;
}

const FreshContext = createContext<Context>({
});

export const useFreshItem = (ref: Ref<FreshItemHandle>) => {
    const {
        onChangeId,
        onCreateIndex, onCompleteIndex
    } = useContext(FreshContext);

    const dnd = useRef<DndItemHandle>(null);
    const fsh = useRef<SelectionItemHandle>(null);

    const index = useItem();
    const dragIndex = useDndItem(dnd);

    const { selectionId, item } = useSelectionItem(fsh);
    const id = item && item.id;

    useImperativeHandle(ref, () => ({
        select: () => fsh.current!.select(),

        drag: () => dnd.current!.drag(),
        drop: () => dnd.current!.drop(),

        change: (value: string) => {
            onChangeId && id &&
                onChangeId(id, value);
        },
        create: () => {
            onCreateIndex &&
                onCreateIndex(index);
            fsh.current!.select();
        },
        complete: () => {
            onCompleteIndex &&
                onCompleteIndex(index);
        },
    }), [id, index]);

    return { index, dragIndex, selectionId, item };
};

interface Props {
    children: ReactNode;
    fresh: readonly (Fresh | null)[];
    ref: Ref<FreshListHandle>;
    newEntryId: Id;
    onSwapIndices?: (leftIndex: number, rightIndex: number) => void;
    onCreateIndex?: (index: number) => void;
    onCompleteIndex?: (index: number) => void;
    onChangeId?: (id: Id, value: string) => void;
}

export const FreshList = ({
    ref,
    children, newEntryId, fresh,
    onChangeId,
    onCreateIndex, onCompleteIndex,
    onSwapIndices
}: Props) => {
    const selectRef = useRef<SelectionListHandle>(null);
    useImperativeHandle(ref, () => ({
        deselect: () => selectRef.current!.deselect()
    }), []);

    const keyAt = useCallback((index: number) => {
        const item = fresh[index];
        return item ? `id-${item.id}` : `indx-${index}`;
    }, [fresh]);

    const context = useMemo(() => ({
        onChangeId,
        onCreateIndex,
        onCompleteIndex
    }), [onChangeId, onCreateIndex, onCompleteIndex]);

    return <SelectionList ref={selectRef} newEntryId={newEntryId} fresh={fresh}>
                <DndList onSwapIndices={onSwapIndices}>
                    <FreshContext value={context}>
                        <List keyAt={keyAt} length={fresh.length}>
                            {children}
                        </List>
                    </FreshContext>
                </DndList>
            </SelectionList>;
};
