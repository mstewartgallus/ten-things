'use client';

import { useRef } from 'react';

import type {
    TenHandle, CompleteHandle, EntryHandle,
    CompleteId
} from "@/lib";
import { useCallback } from 'react';
import { useTen, useComplete, useEntry } from "@/lib";
import { List, useItem, Complete as CompleteComponent } from '@/ui';

import styles from "./CompleteList.module.css";

const CompleteItem = () => {
    const ref = useRef<CompleteHandle>(null);
    const index = useItem();
    const { item } = useComplete(ref, index);
    const { id, completed } = item;

    const entryRef = useRef<EntryHandle>(null);
    const { value, created } = useEntry(entryRef, id)!;

    // const entry = entryAtId(item.id);
    return <li role="listitem" className={styles.item}>
           <div className={styles.marker}>—</div>
           <CompleteComponent value={value} created={created} completed={completed} />
        </li>;
};

export const CompleteThings = () => {
    const ref = useRef<TenHandle>(null);

    const { completeLength } = useTen(ref);

    // FIXME
    const keyAt = useCallback((id: CompleteId) => id, []);
    return <ul role="list" className={styles.list}>
           <List length={completeLength} keyAt={keyAt}>
               <CompleteItem />
            </List>
        </ul>;
};
