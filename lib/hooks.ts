'use client';

import type { Ref } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { compose } from "redux";
import { usePersist } from "./LibProvider";
import { useImperativeHandle } from 'react';
import type { Id } from "./definitions";
import type { AppDispatch, AppStore, RootState } from "./store";
import {
    selectEntryAtId,
    selectFresh,
    selectComplete,

    edit, complete, deleteIndex
} from "@/lib/features/ten/tenSlice";
import {
    selectSelectedIndex,
    selectDragIndex,

    dragStart,
    dragEnd,

    setSelectedIndex,
    deselect,

    create,
    swap
} from "@/lib/features/ui/uiSlice";

export const useAppStore = useStore.withTypes<AppStore>();
const useAppSelector = useSelector.withTypes<RootState>();
const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// FIXME setup a separate thing for each page
export interface TenHandle {
    changeId(id: Id, value: string): void;

    createIndex(index: number): void;
    completeIndex(index: number): void;
    deleteIndex(index: number): void;

    selectIndex(index: number): void;
    deselect(): void;

    dragStartIndex(index: number): void;
    dragEnd(): void;
    dropIndex(index: number): void;
}

export const useTen = (ref: Ref<TenHandle>) => {
    usePersist();

    const dispatch = useAppDispatch();

    const dragIndex = useAppSelector(selectDragIndex);

    useImperativeHandle(ref, () => ({
        changeId: compose(dispatch, edit),
        createIndex: compose(dispatch, create),
        completeIndex: compose(dispatch, complete),
        deleteIndex: compose(dispatch, deleteIndex),

        selectIndex: compose(dispatch, setSelectedIndex),
        deselect: compose(dispatch, deselect),

        dragStartIndex: compose(dispatch, dragStart),
        dragEnd: compose(dispatch, dragEnd),

        dropIndex: index =>
            dragIndex !== undefined &&
                dispatch(swap(dragIndex, index))
    }), [dispatch, dragIndex]);

    return {
        complete: useAppSelector(selectComplete),
        fresh: useAppSelector(selectFresh),
        entryAtId: useAppSelector(selectEntryAtId),

        selectionIndex: useAppSelector(selectSelectedIndex),
        dragIndex
    };
};
