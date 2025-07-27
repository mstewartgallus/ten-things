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
    changeId(id: Id, value: string): Promise<void>;

    createIndex(index: number): Promise<void>;
    completeIndex(index: number): Promise<void>;
    deleteIndex(index: number): Promise<void>;

    selectIndex(index: number): Promise<void>;
    deselect(): Promise<void>;

    dragStartIndex(index: number): Promise<void>;
    dragEnd(): Promise<void>;
    dropIndex(index: number): Promise<void>;
}

export const useTen = (ref: Ref<TenHandle>) => {
    usePersist();

    const dispatch = useAppDispatch();

    const dragIndex = useAppSelector(selectDragIndex);

    useImperativeHandle(ref, () => ({
        changeId: async (...x) => {
            await dispatch(edit(...x));
        },
        createIndex: async (...x) => {
            await dispatch(create(...x));
        },
        completeIndex: async (...x) => {
            await dispatch(complete(...x));
        },
        deleteIndex: async (...x) => {
            await dispatch(deleteIndex(...x));
        },

        selectIndex: async (...x) => {
            await dispatch(setSelectedIndex(...x));
        },
        deselect: async (...x) => {
            await dispatch(deselect(...x));
        },

        dragStartIndex: async (...x) => {
            await dispatch(dragStart(...x));
        },
        dragEnd: async (...x) => {
            await dispatch(dragEnd(...x));
        },

        dropIndex: async index => {
            if (dragIndex === undefined) {
                return;
            }
            await dispatch(swap(dragIndex, index));
        }
    }), [dispatch, dragIndex]);

    return {
        complete: useAppSelector(selectComplete),
        fresh: useAppSelector(selectFresh),
        entryAtId: useAppSelector(selectEntryAtId),

        selectionIndex: useAppSelector(selectSelectedIndex),
        dragIndex
    };
};
