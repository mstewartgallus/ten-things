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

    edit, create, complete, swap
} from "@/lib/features/ten/tenSlice";

export const useAppStore = useStore.withTypes<AppStore>();
const useAppSelector = useSelector.withTypes<RootState>();
const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export interface TenHandle {
    changeId(id: Id, value: string): void;

    createIndex(index: number): void;
    completeIndex(index: number): void;

    swapIndices(leftIndex: number, rightIndex: number): void;
}

export const useTen = (ref: Ref<TenHandle>) => {
    usePersist();

    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => ({
        changeId: compose(dispatch, edit),
        createIndex: compose(dispatch, create),
        completeIndex: compose(dispatch, complete),
        swapIndices: compose(dispatch, swap)
    }), [dispatch]);

    return {
        complete: useAppSelector(selectComplete),
        fresh: useAppSelector(selectFresh),
        entryAtId: useAppSelector(selectEntryAtId)
    };
};
