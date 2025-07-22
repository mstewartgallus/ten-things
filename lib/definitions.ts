export type Id = number;

export interface Entry {
    value: string;
    created: number;
}

export interface Fresh {
    id: Id;
}

export interface Complete {
    id: Id;
    completed: number;
}
