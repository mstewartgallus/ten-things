'use client';

import type { Id, Entry } from '@/lib';
import type { FreshItemHandle } from '@/ui';
import type { TenHandle } from '@/lib';

import { useCallback, useMemo, useRef } from 'react';
import { DragButton, DropButton, MainLabel,
         FreshCreate, FreshEdit,
         FreshList, useFreshItem,
         H1, Header } from '@/ui';
import { useTen } from '@/lib';

import styles from './TenThings.module.css';

const useFreshCount = () => {
    const ref = useRef<TenHandle>(null);
    const { fresh } = useTen(ref);
    return useMemo(() => fresh.reduce((x, y) => (y != null ? 1 : 0) + x, 0),
            [fresh]);
};

const Heading = () => {
    const count = useFreshCount();
    return <>{count} / 10 Things</>
};

interface ItemProps {
    entryAtId(id: Id): Entry;

    deselectAction?: () => Promise<void>;
}

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

const Item = ({ entryAtId, deselectAction }: ItemProps) => {
    const ref = useRef<FreshItemHandle>(null);

    const { index, dragIndex, selectionIndex, item } = useFreshItem(ref);

    const selected = selectionIndex === index;
    const isDragging = dragIndex !== undefined;
    const draggingMe = dragIndex === index;

    const changeAction = useCallback(async (value: string) => await ref.current!.change(value), []);
    const completeAction = useCallback(async () => await ref.current!.complete(), []);
    const deleteAction = useCallback(async () => await ref.current!.deleteIndex(), []);
    const createAction = useCallback(async () => await ref.current!.create(), []);

    const selectAction = useCallback(async () => await ref.current!.select(), []);

    const dragStartAction = iff(!isDragging,
                            useCallback(async () => await ref.current!.dragStart(), []));
    const dropAction = iff(isDragging && !draggingMe,
                       useCallback(async () => await ref.current!.drop(), []));

    return <li role="listitem" className={styles.item}>
            <DropButton action={dropAction} />
            <DragButton dragging={isDragging} dragStartAction={dragStartAction}>
                <div className={styles.grabberIcon}>&</div>
            </DragButton>
        {
            item ?
                <FreshEdit disabled={isDragging}
                    {...entryAtId(item.id)} selected={selected}
                    changeAction={changeAction}
                    selectAction={iff(!selected, selectAction)}
                    deselectAction={iff(selectionIndex !== undefined, deselectAction)}
                    completeAction={completeAction} deleteAction={deleteAction}
                /> :
            <FreshCreate disabled={isDragging} createAction={createAction} />
        }
        </li>;
};

const TenFresh = () => {
    const ref = useRef<TenHandle>(null);
    const { fresh, entryAtId, selectionIndex, dragIndex } = useTen(ref);

    const createAction = useCallback(async (index: number) => await ref.current!.createIndex(index), []);

    const changeAction = useCallback(async (id: Id, value: string) => await ref.current!.changeId(id, value), []);
    const completeAction = useCallback(async (index: number) => await ref.current!.completeIndex(index), []);
    const deleteAction = useCallback(async (index: number) => await ref.current!.deleteIndex(index), []);

    const selectAction = useCallback(async (index: number) => await ref.current!.selectIndex(index), []);
    const deselectAction = useCallback(async () => {
        await ref.current!.deselect();
    }, []);

    const dragStartAction = useCallback((index: number) => ref.current!.dragStartIndex(index), []);
    const dropAction = useCallback((index: number) => ref.current!.dropIndex(index), []);

    return <ul role="list" className={styles.list}>
            <FreshList
                fresh={fresh} dragIndex={dragIndex}
                selectionIndex={selectionIndex}
                selectAction={selectAction}
                changeAction={changeAction}
                createAction={createAction}
                completeAction={completeAction}
                deleteAction={deleteAction}
                dragStartAction={dragStartAction}
                dropAction={dropAction}
                >
                <Item entryAtId={entryAtId} deselectAction={deselectAction} />
            </FreshList>
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
