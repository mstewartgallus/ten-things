'use client';

import type { UnknownAction } from "redux";

// FIXME
import {
    selectNewEntryId,
    selectEntryAtId,
    selectFresh,
    selectComplete,

    edit, create, complete, swap
} from "@/lib/features/ten/tenSlice";

import { useAppDispatch, useAppSelector } from "@/lib";
import { useCallback } from 'react';

type Tuple = unknown[];
type ActionCreator<T extends Tuple> = (...x: T) => UnknownAction;
type ActionDispatcher<T extends Tuple> = (...x: T) => void;

const useDispatchAction:
    <T extends Tuple>(actionCreator: ActionCreator<T>) => ActionDispatcher<T>
    = <T extends Tuple>(actionCreator: ActionCreator<T>) => {
        const dispatch = useAppDispatch();
        return useCallback(
            (...x: T) => dispatch(actionCreator(...x)),
            [dispatch, actionCreator]);
    };

export const useNewEntryId = () => useAppSelector(selectNewEntryId);
export const useEntryAtId = () => useAppSelector(selectEntryAtId);
export const useFresh = () => useAppSelector(selectFresh);
export const useComplete = () => useAppSelector(selectComplete);

export const useOnChangeId = () => useDispatchAction(edit);
export const useOnCreateIndex = () => useDispatchAction(create);
export const useOnCompleteIndex = () => useDispatchAction(complete);
export const useOnSwapIndices = () => useDispatchAction(swap);
