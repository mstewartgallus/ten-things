'use client';

import type { ReactNode, Ref } from 'react';
import type { Id, Fresh } from "@/lib";
import { createContext, useContext, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { List, useItem } from '../list';

export interface FreshItemHandle {
    dragStart(): Promise<void>;
    drop(): Promise<void>;

    select(): Promise<void>;

    change(value: string): Promise<void>;
    create(): Promise<void>;
    complete(): Promise<void>;
    deleteIndex(): Promise<void>;
}

export interface FreshListHandle {
    dragEnd(): void;
}

interface Context {
    fresh: readonly (Fresh | null)[];

    selectionIndex?: number;
    selectAction?: (index: number) => Promise<void>;

    dragIndex?: number;
    dragStartAction?: (index: number) => Promise<void>;
    dropAction?: (index: number) => Promise<void>;
    changeAction?: (id: Id, value: string) => Promise<void>;
    createAction?: (index: number) => Promise<void>;
    deleteAction?: (index: number) => Promise<void>;
    completeAction?: (index: number) => Promise<void>;
}

const FreshContext = createContext<Context>({
    fresh: []
});

export const useFreshItem = (ref: Ref<FreshItemHandle>) => {
    const {
        fresh,
        selectionIndex,
        dragIndex,
        dragStartAction,
        dropAction,
        selectAction,
        changeAction,
        createAction, completeAction,
        deleteAction
    } = useContext(FreshContext);

    const index = useItem();

    const item = fresh[index];
    const id = item && item.id;

    useImperativeHandle(ref, () => {
        const noop = async () => {};

        return {
            select: selectAction ?
                async () => await selectAction(index) :
                noop,

            dragStart: dragStartAction ?
                async () => await dragStartAction(index) :
                noop,
            drop: dropAction ?
                async () => await dropAction(index) :
                noop,

            change: (changeAction && id) ?
                async (value: string) => await changeAction(id, value) :
            noop,

            create: createAction ?
                async () => await createAction(index) :
                noop,
            complete: completeAction ?
                async () => await completeAction(index) :
                noop,

            deleteIndex: deleteAction ?
                async () => await deleteAction(index) :
                noop
        };
    }, [
        id, index, selectAction, dragStartAction, changeAction,
        createAction, completeAction, deleteAction
    ]);

    return { index, dragIndex, selectionIndex, item };
};

interface Props {
    children: ReactNode;
    fresh: readonly (Fresh | null)[];

    selectionIndex?: number;
    dragIndex?: number;

    selectAction?: (index: number) => Promise<void>;

    createAction?: (index: number) => Promise<void>;
    completeAction?: (index: number) => Promise<void>;
    deleteAction?: (index: number) => Promise<void>;

    dragStartAction?: (index: number) => Promise<void>;
    dropAction?: (index: number) => Promise<void>;

    changeAction?: (id: Id, value: string) => Promise<void>;
}

export const FreshList = ({
    children, fresh,
    selectionIndex,
    dragIndex,
    dragStartAction, dropAction,
    changeAction,
    selectAction,
    createAction, completeAction,
    deleteAction
}: Props) => {
    const keyAt = useCallback((index: number) => {
        const item = fresh[index];
        return item ? `id-${item.id}` : `indx-${index}`;
    }, [fresh]);

    const context = useMemo(() => ({
        fresh,
        selectionIndex,
        dragIndex,
        dragStartAction,
        dropAction,
        selectAction,
        changeAction,
        createAction,
        completeAction,
        deleteAction
    }), [fresh, selectionIndex, dragIndex, dragStartAction, dropAction,
         selectAction, changeAction, createAction, completeAction, deleteAction]);

    return <FreshContext value={context}>
        <List keyAt={keyAt} length={fresh.length}>
           {children}
         </List>
        </FreshContext>;
};
