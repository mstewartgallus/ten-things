export type EntryId = number;
export type FreshId = number;
export type CompleteId = number;

export interface Entry {
    value: string;
    created: number;
}

export type Fresh = null | {
    id: EntryId;
}

export interface Complete {
    id: EntryId;
    completed: number;
}
