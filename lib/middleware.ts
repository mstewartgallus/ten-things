import type { Middleware } from "@reduxjs/toolkit";
import type { TenSliceState } from "./features/ten/tenSlice";

const checkState = (state: TenSliceState) => {
    const entryLength = state.entry.length;

    for (const [index, fresh] of state.fresh.entries()) {
        if (!fresh) {
            continue;
        }
        const { id } = fresh;
        if (id >= entryLength) {
            throw Error(`non-existent fresh id ${id} at index ${index} out of fresh ${entryLength}`);
        }
    }

    for (const [index, complete] of state.complete.entries()) {
        const { id } = complete;
        if (id >= entryLength) {
            throw Error(`non-existent complete id ${id} at index ${index} out of entries ${entryLength}`);
        }
    }

    for (const [index, fresh] of state.fresh.entries()) {
        if (!fresh) {
            continue;
        }
        const { id } = fresh;
        const otherIndex = state.fresh.findIndex(other => other && other.id === id);
        if (otherIndex >= 0 && index !== otherIndex) {
            throw Error(`duplicate fresh id ${id} at index ${index} and ${otherIndex}`);
        }
    }

    for (const [index, complete] of state.complete.entries()) {
        const { id } = complete;
        const otherIndex = state.complete.findIndex(other => other.id === id);
        if (otherIndex >= 0 && index !== otherIndex) {
            throw Error(`duplicate complete id ${id} at index ${index} and ${otherIndex}`);
        }
    }
};

interface HasTenState {
    ten: TenSliceState
}

// FIXME this is not the way to do this
type TenMiddleware = Middleware<{}, HasTenState>; // eslint-disable-line

export const tenValidate: TenMiddleware = ({ getState }) => next => action => {
    checkState(getState().ten);
    const returnValue = next(action);
    checkState(getState().ten);
    return returnValue;
};
