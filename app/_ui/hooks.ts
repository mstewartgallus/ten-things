import type { UnknownAction } from "redux";
import type { Selector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

import {
    selectNewEntryId,
    selectEntryAtId,
    selectFresh,
    selectComplete,

    edit, create, complete, swap
} from "@/lib/features/ten/tenSlice";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback } from 'react';
import { usePersisting } from './StoreProvider';

type Tuple = unknown[];
type ActionCreator<T extends Tuple> = (...x: T) => UnknownAction;
type ActionDispatcher<T extends Tuple> = (...x: T) => void;

const useDispatchAction:
    <T extends Tuple>(actionCreator: ActionCreator<T>) => ActionDispatcher<T>
    = <T extends Tuple>(actionCreator: ActionCreator<T>) => {
        usePersisting();
        const dispatch = useAppDispatch();
        return useCallback(
            (...x: T) => dispatch(actionCreator(...x)),
            [dispatch, actionCreator]);
    };

const useSelector: <T>(selector: Selector<RootState, T>) => T = <T>(selector: Selector<RootState, T>) => {
    usePersisting();
    return useAppSelector(selector);
};

export const useNewEntryId = () => useSelector(selectNewEntryId);
export const useEntryAtId = () => useSelector(selectEntryAtId);
export const useFresh = () => useSelector(selectFresh);
export const useComplete = () => useSelector(selectComplete);

export const useOnChangeId = () => useDispatchAction(edit);
export const useOnCreateIndex = () => useDispatchAction(create);
export const useOnCompleteIndex = () => useDispatchAction(complete);
export const useOnSwapIndices = () => useDispatchAction(swap);
