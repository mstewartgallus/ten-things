"use client";

import { useEntryAtId, useComplete } from "../hooks";
import { CompleteList } from '@/ui/complete-list/CompleteList';

export const CompleteThings = () => {
    const entryAtId = useEntryAtId();
    const complete = useComplete();

    return <CompleteList complete={complete} entryAtId={entryAtId} />;
};
