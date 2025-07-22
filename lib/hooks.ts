import type { UnknownAction } from "redux";
import type { Selector } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, AppStore, RootState } from "./store";
import { usePersisting } from "./StoreProvider";

const useAppSelectorPrim = useSelector.withTypes<RootState>();
const useAppStorePrim = useStore.withTypes<AppStore>();
const useAppDispatchPrim = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = <T>(selector: Selector<RootState, T>) => {
    usePersisting();
    return useAppSelectorPrim(selector);
};

export const useAppStore = () => {
    usePersisting();
    return useAppStorePrim();
};

export const useAppDispatch = () => {
    usePersisting();
    return useAppDispatchPrim();
};
