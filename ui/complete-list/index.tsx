'use client';

import type { Id, Entry, Complete } from "@/lib";

import { useCallback } from 'react';
import { Complete as CompleteComponent } from '../complete';
import { List, useItem } from '../list';

interface Props {
    complete: readonly Complete[];
    entryAtId: (id: Id) => Entry;
}

const CompleteItem = ({ complete, entryAtId }: Props) => {
    const index = useItem();
    const item = complete[index];
    const entry = entryAtId(item.id);
    return <li role="listitem">
            <CompleteComponent {...entry} completed={item.completed} />
        </li>;
};

export const CompleteList = ({ complete, entryAtId }: Props) => {
    const keyAt = useCallback((index: number) => complete[index].id, [complete]);
    return <ul role="list">
           <List length={complete.length} keyAt={keyAt}>
               <CompleteItem complete={complete} entryAtId={entryAtId} />
            </List>
        </ul>;
};
