'use client';

import type { TenHandle, FreshHandle, EntryHandle } from '@/lib';

import { useCallback, useMemo, useRef } from 'react';
import { DragButton, DropButton, MainLabel,
         FreshCreate, FreshEdit,
         List, useItem,
         H1, Header } from '@/ui';
import { useTen, useFresh, useEntry } from '@/lib';

import styles from './TenThings.module.css';

const useFreshCount = () => {
    const ref = useRef<TenHandle>(null);
    const { freshNonNull } = useTen(ref);
    return freshNonNull;
};

const Heading = () => {
    const count = useFreshCount();
    return <>{count} / 10 Things</>
};

interface ItemProps {
    anyDragging: boolean;
    deselectAction?: () => Promise<void>;
}

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

const Item = ({ anyDragging, deselectAction }: ItemProps) => {
    const index = useItem();
    const fsh = useRef<FreshHandle>(null);
    const { item, selected, dragging } = useFresh(fsh, index);

    const entryRef = useRef<EntryHandle>(null);
    const entry = useEntry(entryRef, (item && item.id) ?? undefined);

    const changeAction = useCallback(async (value: string) => await entryRef.current!.change(value), []);

    const completeAction = useCallback(async () => await fsh.current!.complete(), []);
    const deleteAction = useCallback(async () => await fsh.current!.deleteFresh(), []);
    const createAction = useCallback(async () => await fsh.current!.create(), []);

    const selectAction = useCallback(async () => await fsh.current!.select(), []);
    const dragStartAction = useCallback(async () => await fsh.current!.drag(), []);
    const dropAction = iff(anyDragging && !dragging,
                       useCallback(async () => await fsh.current!.drop(), []));

    return <li role="listitem" className={styles.item}>
            <DropButton action={dropAction} />
            <DragButton dragging={dragging} dragStartAction={dragStartAction}>
                <div className={styles.grabberIcon}>&</div>
            </DragButton>
        {
            entry ?
                <FreshEdit disabled={dragging}
                    {...entry} selected={selected}
                    changeAction={changeAction}
                    selectAction={iff(!selected, selectAction)}
                    deselectAction={deselectAction}
                    completeAction={completeAction} deleteAction={deleteAction}
                /> :
            <FreshCreate disabled={dragging} createAction={createAction} />
        }
        </li>;
};

const TenFresh = () => {
    const ref = useRef<TenHandle>(null);
    const { freshLength, dragging } = useTen(ref);

    const deselectAction = useCallback(async () => {
        await ref.current!.deselect();
    }, []);

    // FIXME
    const keyAt = useCallback((index: number) => {
        // const item = fresh[index];
        // return item ? `id-${item.id}` : `indx-${index}`;
        return index;
    }, []);

    return <ul role="list" className={styles.list}>
            <List length={freshLength} keyAt={keyAt}>
                <Item anyDragging={dragging} deselectAction={deselectAction} />
            </List>
        </ul>;
};

export const TenThings = () =>
    <>
        <MainLabel>
            <Header>
                <H1>
                    <Heading />
                </H1>
            </Header>
        </MainLabel>
       <TenFresh />
    </>;
