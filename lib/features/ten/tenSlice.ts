import type { PayloadAction, Selector } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { Id, Entry, Fresh, Complete } from "@/lib/definitions";
import { swap, create } from "../ui/uiSlice";

interface EditAction {
    id: Id;
    value: string;
}

interface CompleteAction {
    index: number;
    completed: number;
}

interface DeleteAction {
    index: number;
}

export interface TenSliceState {
    entry: Entry[],
    fresh: (Fresh | null)[],
    complete: Complete[]
};

const initialState: TenSliceState = (() => {
    const fresh = Array(10).fill(null);
    return {
        entry: [],
        fresh,
        complete: []
    };
})();

type TenSelector<T> = Selector<TenSliceState, T>;

const selectEntry: TenSelector<readonly Entry[]> = ten => ten.entry;

const checkIndex = <T>(array: readonly T[], index: number) => {
    const { length } = array;
    if (index < 0 || index >= length) {
        throw Error(`${index} out of bounds of array of length ${length}`);
    }
};

export const tenSlice = createSlice({
    name: "ten",

    initialState,

    reducers: create => ({
        edit: create.preparedReducer(
            (id: Id, value: string) => ({ payload: {id, value } })
            ,
            ({ entry }, { payload: { id, value } }: PayloadAction<EditAction>) => {
            checkIndex(entry, id);

            entry[id].value = value;
        }),

        deleteIndex: create.preparedReducer(
            (index: number) => ({ payload: { index } })
            ,
            ({ fresh }, { payload: { index } }: PayloadAction<DeleteAction>) => {
                checkIndex(fresh, index);
                // FIXME what to do about the leftover garbage entry?
                fresh[index] = null;
        }),

        complete: create.preparedReducer(
            index => {
                const completed = Date.now();
                return { payload: { index, completed } };
            }, ({ fresh, complete }, { payload: { index, completed } }: PayloadAction<CompleteAction>) => {
                checkIndex(fresh, index);

                const oldFresh = fresh[index];
                if (!oldFresh) {
                    throw Error(`fresh ${index} is empty`);
                }
                fresh[index] = null;
                complete.unshift({ ...oldFresh, completed });
            }),
    }),

    extraReducers: builder => {
        builder
            .addCase(swap,
                     ({ fresh }, { payload: { indexLeft, indexRight } }) => {
                         checkIndex(fresh, indexLeft);
                         checkIndex(fresh, indexRight);

                         const leftFresh = fresh[indexLeft];
                         fresh[indexLeft] = fresh[indexRight];
                         fresh[indexRight] = leftFresh;
                     })
            .addCase(create,
                     ({ fresh, entry }, { payload: { index, created } }) => {
                         checkIndex(fresh, index);
                         if (fresh[index]) {
                             throw Error(`fresh ${index} is non-empty`);
                         }

                         const id = entry.length;

                         entry.push({ created, value: '' });
                         fresh[index] = { id };
                     })

    },

    selectors: {
        selectEntryAtId: createSelector([selectEntry], entry => (id: Id) => entry[id]),

        selectFresh: ten => ten.fresh,
        selectComplete: ten => ten.complete
    },
});

export const {
    edit,
    complete,
    deleteIndex
} = tenSlice.actions;

export const {
    selectEntryAtId,
    selectFresh,
    selectComplete
} = tenSlice.selectors;
