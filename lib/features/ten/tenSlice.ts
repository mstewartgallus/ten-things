import type { PayloadAction, Selector } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type {
    EntryId, FreshId, CompleteId,
    Entry, Fresh, Complete
} from "@/lib/definitions";

interface EditAction {
    id: EntryId;
    value: string;
}

interface CompleteAction {
    id: FreshId;
    completed: number;
}

interface SelectAction {
    id: FreshId;
}

interface DragAction {
    id: FreshId;
}

interface CreateAction {
    id: FreshId;
    value: string;
    created: number;
}

interface DropAction {
    id: FreshId;
}

// FIXME factor out into multiple slices?
export interface TenSliceState {
    ten: {
        entry: Entry[];
        fresh: Fresh[];
        complete: Complete[];
    };
    ui: {
        dragId?: FreshId;
        selectionId?: FreshId;
    };
};

const initialState: TenSliceState = (() => {
    const fresh = Array(10).fill(null);
    return {
        ten: {
            entry: [],
            fresh,
            complete: []
        },
        ui: {
            dragId: undefined,
            selectionId: undefined
        }
    };
})();

type TenSelector<T> = Selector<TenSliceState, T>;

const selectDragId: TenSelector<FreshId | undefined> = ({ ui }) => ui.dragId;
const selectSelectionId: TenSelector<FreshId | undefined> = ({ ui }) => ui.selectionId;

const selectEntryArray: TenSelector<readonly Entry[]> = ({ ten }) => ten.entry;
const selectFreshArray: TenSelector<readonly Fresh[]> = ({ ten }) => ten.fresh;
const selectCompleteArray: TenSelector<readonly Complete[]> = ({ ten }) => ten.complete;

const checkId = <T>(array: readonly T[], id: number) => {
    const { length } = array;
    if (id < 0 || id >= length) {
        throw Error(`${id} out of bounds of array of length ${length}`);
    }
};

export const tenSlice = createSlice({
    name: "ten",

    initialState,

    reducers: create => ({
        edit: create.preparedReducer(
            (id: EntryId, value: string) => ({ payload: { id, value } })
            ,
            ({ ui, ten: { entry } }, { payload: { id, value } }: PayloadAction<EditAction>) => {
                checkId(entry, id);

                entry[id].value = value;

                ui.selectionId = undefined;
            }),

        create: create.preparedReducer(
            (id: FreshId, value: string) => {
                const created = Date.now();
                return { payload: { id, value, created } };
            },
            ({ ui, ten: { entry, fresh } }, { payload: { id, value, created } }: PayloadAction<CreateAction>) => {
                ui.selectionId = id;

                checkId(fresh, id);
                if (fresh[id]) {
                    throw Error(`fresh ${id} is non-empty`);
                }

                const entryId = entry.length;

                entry.push({ created, value });
                fresh[id] = { id: entryId };

                ui.dragId = undefined;
                ui.selectionId = undefined;
            }),

        complete: create.preparedReducer(
            (id: FreshId) => {
                const completed = Date.now();
                return { payload: { id, completed } };
            }, ({ ten: { fresh, complete } }, { payload: { id, completed } }: PayloadAction<CompleteAction>) => {
                checkId(fresh, id);

                const oldFresh = fresh[id];
                if (!oldFresh) {
                    throw Error(`fresh ${id} is empty`);
                }
                fresh[id] = null;
                complete.unshift({ ...oldFresh, completed });
            }),

        select: create.preparedReducer(
            (id: FreshId) => ({ payload: { id } }),
            ({ ui }, { payload: { id } }: PayloadAction<SelectAction>) => {
                ui.dragId = undefined;
                ui.selectionId = id;
            }),
        deselect: create.preparedReducer(
            () => ({ payload: null }),
            ({ ui }) => {
                ui.dragId = undefined;
                ui.selectionId = undefined;
            }),

        drag: create.preparedReducer(
            (id: FreshId) => ({ payload: { id } }),
            ({ ui }, { payload: { id } }: PayloadAction<DragAction>) => {
                ui.dragId = id;
                ui.selectionId = undefined;
            }),
        dragEnd: create.preparedReducer(
            () => ({ payload: null }),
            ({ ui }: PayloadAction<null>) => {
                ui.dragId = undefined;
            }),

        // Not sure if this is a sensible way of organizing things
        drop: create.preparedReducer(
            (id: FreshId) => ({ payload: { id } }),
            ({ ui, ten: { fresh }}, { payload: { id } }: PayloadAction<DropAction>) => {
                const { dragId } = ui;
                if (dragId === undefined) {
                    throw Error("not dragging");
                }

                checkId(fresh, id);
                checkId(fresh, dragId);

                const old = fresh[dragId];
                fresh[dragId] = fresh[id];
                fresh[id] = old;

                ui.dragId = undefined;
                ui.selectionId = undefined;
            })
    }),
    selectors: {
        selectHasSelection: createSelector(
            selectSelectionId,
            (id?: FreshId) => id !== undefined),
        selectHasDragging: createSelector(
            selectDragId,
            (dragId?: FreshId) => dragId !== undefined),

        selectDragging: createSelector(
            selectDragId,
            dragId => (id: FreshId) => dragId === id),
        selectSelected: createSelector(
            selectSelectionId,
            selectionId => (id: FreshId) => selectionId === id),

        selectEntry: createSelector(
            selectEntryArray,
            entry => (id: FreshId) => entry[id]),

        selectFreshNonNull: createSelector(
            selectFreshArray,
            fresh => fresh.reduce((x, y) => (y !== null ? 1 : 0) + x, 0)),
        selectFreshLength: createSelector(
            selectFreshArray,
            fresh => fresh.length),
        selectFresh: createSelector(
            selectFreshArray,
            fresh => (id: FreshId) => fresh[id]),

        selectCompleteLength: createSelector(
            selectCompleteArray,
            complete => complete.length),
        selectComplete: createSelector(
            selectCompleteArray,
            complete => (id: CompleteId) => complete[id])
    },
});

export const {
    edit,
    create,
    complete,

    select,
    deselect,

    drag,
    dragEnd,
    drop
} = tenSlice.actions;

export const {
    selectEntry,

    selectFreshNonNull,
    selectFreshLength,
    selectFresh,

    selectCompleteLength,
    selectComplete,

    selectHasSelection,
    selectHasDragging,

    selectSelected,
    selectDragging
} = tenSlice.selectors;
