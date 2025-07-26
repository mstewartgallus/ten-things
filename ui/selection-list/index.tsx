'use client';

import type { ReactNode, Ref } from 'react';
import type { Id, Fresh } from "@/lib";
import { createContext, useContext, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useItem } from '../list';

interface Context {
    fresh: readonly (Fresh | null)[];
    selectionId?: Id;
    selectId(id: Id): void;
    newEntryId: Id;
}
const SelectionContext = createContext<Context>({
    fresh: [],
    selectId: () => {},
    newEntryId: -1
});

export interface SelectionItemHandle {
    select(): void;
}

export const useSelectionItem = (ref: Ref<SelectionItemHandle>) => {
    const index = useItem();
    const {
        fresh,
        selectionId,
        selectId,
        newEntryId
    } = useContext(SelectionContext);

    const item = fresh[index] ?? undefined;
    const id = item && item.id;

    useImperativeHandle(ref, () => {
        if (!id) {
            return {
                select: () => selectId(newEntryId),
            };
        }
        return {
            select: () => selectId(id)
        }
    }, [id, newEntryId]);
    return { selectionId, item };
};

export interface SelectionListHandle {
    deselect(): void;
}

interface Props {
    children: ReactNode,
    ref: Ref<SelectionListHandle>;
    fresh: readonly (Fresh | null)[];
    newEntryId: Id,
}

export const SelectionList = ({
    children,
    ref,
    fresh,
    newEntryId
}: Props) => {
    const [selectionId, setSelectionId] = useState<Id | null>(null);

    const selectId = useCallback((id: Id) => setSelectionId(id), []);

    useImperativeHandle(ref, () => ({
        deselect: () => setSelectionId(null)
    }), []);

    const context = useMemo(() => ({
        selectionId: selectionId ?? undefined,
        selectId,
        newEntryId,
        fresh
    }), [
        selectionId, selectId, newEntryId, fresh
    ]);
    return <SelectionContext value={context}>
            {children}
    </SelectionContext>;
};
