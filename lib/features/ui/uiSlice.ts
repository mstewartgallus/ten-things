/* eslint-disable no-unused-vars */

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// FIXME factor out into multiple slices?
interface SelectAction {
    index: number;
}

interface DragStartAction {
    index: number;
}

type DragEndAction = void;

interface CreateAction {
    index: number;
    created: number;
}

interface SwapAction {
    indexLeft: number;
    indexRight: number;
}

export interface UiSliceState {
    selectedIndex?: number
    dragIndex?: number;
};

const initialState: UiSliceState = (() => {
    return {
    };
})();

export const uiSlice = createSlice({
    name: "ui",

    initialState,

    reducers: create => ({
        setSelectedIndex: create.preparedReducer(
            (index: number) => ({ payload: { index } }),
            (state, { payload: { index } }: PayloadAction<SelectAction>) => {
                state.selectedIndex = index;
            }),
        deselect: create.reducer(
            (state, _payload : PayloadAction<void>) => {
                state.selectedIndex = undefined;
            }),

        dragStart: create.preparedReducer(
            (index: number) => ({ payload: { index } }),
            (state, { payload: { index } }: PayloadAction<DragStartAction>) => {
                state.dragIndex = index;
            }),
        dragEnd: create.reducer(
            (state, _payload: PayloadAction<DragEndAction>) => {
                state.dragIndex = undefined;
            }),

        create: create.preparedReducer(
            (index: number) => {
                const created = Date.now();
                return { payload: { index, created } };
            },
            (state, { payload: { index } }: PayloadAction<CreateAction>) => {
                state.selectedIndex = index;
        }),

        // Not sure if this is a sensible way of organizing things
        swap: create.preparedReducer(
            (indexLeft: number, indexRight: number) => ({ payload: { indexLeft, indexRight } }),
            (state, _payload: PayloadAction<SwapAction>) => {

                state.dragIndex = undefined;
        })
    }),

    selectors: {
        selectSelectedIndex: ui => ui.selectedIndex,
        selectDragIndex: ui => ui.dragIndex
    }
});

export const {
    setSelectedIndex,
    deselect,

    dragStart,
    dragEnd,

    swap,
    create
} = uiSlice.actions;

export const {
    selectSelectedIndex,
    selectDragIndex
} = uiSlice.selectors;
