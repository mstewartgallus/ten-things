'use client';

import type { Ref } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { usePersist } from "./LibProvider";
import { useImperativeHandle } from 'react';
import type { EntryId, FreshId, CompleteId } from "./definitions";
import type { AppDispatch, AppStore, RootState } from "./store";
import {
    selectEntry,

    selectFreshNonNull,
    selectFreshLength,
    selectFresh,

    selectCompleteLength,
    selectComplete,

    selectHasSelection,
    selectHasDragging,

    selectSelected,
    selectDragging,

    drag,
    drop,
    select,
    deselect,

    create,
    edit, complete
} from "@/lib/features/ten/tenSlice";

export const useAppStore = useStore.withTypes<AppStore>();
const useAppSelector = useSelector.withTypes<RootState>();
const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// FIXME setup a separate thing for each page?
export interface TenHandle {
    deselect(): Promise<void>;
    // dragEnd(): Promise<void>;
}

export const useTen = (ref: Ref<TenHandle>) => {
    usePersist();

    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => ({
        deselect: async () => {
            await dispatch(deselect());
        }
    }), [dispatch]);

    const selected = useAppSelector(selectHasSelection);
    const dragging = useAppSelector(selectHasDragging);
    const freshNonNull = useAppSelector(selectFreshNonNull);

    return {
        completeLength: useAppSelector(selectCompleteLength),
        freshLength: useAppSelector(selectFreshLength),

        freshNonNull,

        selected,
        dragging
    };
};

export interface FreshHandle {
    create(): Promise<void>;
    complete(): Promise<void>;

    select(): Promise<void>;

    drag(): Promise<void>;
    drop(): Promise<void>;
}

export const useFresh = (ref: Ref<FreshHandle>, id: FreshId) => {
    usePersist();

    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => ({
        create: async (value: string) => {
            await dispatch(create(id, value));
        },

        complete: async () => {
            await dispatch(complete(id));
        },

        select: async () => {
            await dispatch(select(id));
        },

        drag: async () => {
            await dispatch(drag(id));
        },

        drop: async () => {
            await dispatch(drop(id));
        },
    }), [dispatch, id]);

    const item = useAppSelector(selectFresh)(id);
    const dragging = useAppSelector(selectDragging)(id);
    const selected = useAppSelector(selectSelected)(id);

    return { item, selected, dragging };
};


export type CompleteHandle = void;

export const useComplete = (ref: Ref<CompleteHandle>, id: CompleteId) => {
    usePersist();

    useImperativeHandle(ref, () => ({
    }), []);

    const complete = useAppSelector(selectComplete);

    return {
        item: complete(id)
    };
};

export interface EntryHandle {
    change(value: string): Promise<void>;
}

export const useEntry = (ref: Ref<EntryHandle>, id: EntryId) => {
    usePersist();

    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => {
        return {
            change: async (value: string) => {
                await dispatch(edit(id, value));
            }
        };
    }, [dispatch, id]);

    return useAppSelector(selectEntry)(id);
};
