'use client';

import type { Selector } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { usePersist } from "./LibProvider";

import type { AppDispatch, AppStore, RootState } from "./store";

export const useAppStore = useStore.withTypes<AppStore>();

const useAppSelectorPrim = useSelector.withTypes<RootState>();

const useAppDispatchPrim = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = <T>(selector: Selector<RootState, T>) => {
    usePersist();
    return useAppSelectorPrim(selector);
};

export const useAppDispatch = () => {
    usePersist();
    return useAppDispatchPrim();
};
