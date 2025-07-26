'use client';

import type { ReactNode, Ref } from 'react';
import type { Id, Fresh } from "@/lib";
import { createContext, useContext, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useItem } from '../list';

interface Context {
    fresh: readonly (Fresh | null)[];
    selectionId?: Id;
    onSelectId?: (id: Id) => void;
}
const SelectionContext = createContext<Context>({
    fresh: []
});

export interface SelectionItemHandle {
    select(): void;
}

export const useSelectionItem = (ref: Ref<SelectionItemHandle>) => {
    const index = useItem();
    const {
        fresh,
        selectionId,
        onSelectId
    } = useContext(SelectionContext);

    const item = fresh[index] ?? undefined;
    const id = item && item.id;

    useImperativeHandle(ref, () => {
        return {
            select: onSelectId && id ? () => onSelectId(id) : () => {}
        }
    }, [id]);
    return { selectionId, item };
};

export interface SelectionListHandle {
    selectId(id: Id): void;
    deselect(): void;
}

interface Props {
    children: ReactNode,
    ref: Ref<SelectionListHandle>;
    fresh: readonly (Fresh | null)[];
}

export const SelectionList = ({
    children,
    ref,
    fresh
}: Props) => {
    const [selectionId, setSelectionId] = useState<Id | null>(null);
    useImperativeHandle(ref, () => ({
        selectId: (id: Id) => setSelectionId(id),
        deselect: () => setSelectionId(null)
    }), []);

    const onSelectId = useCallback((id: Id) => setSelectionId(id), []);

    const context = useMemo(() => ({
        selectionId: selectionId ?? undefined,
        onSelectId,
        fresh
    }), [
        selectionId, onSelectId, fresh
    ]);
    return <SelectionContext value={context}>
            {children}
    </SelectionContext>;
};
