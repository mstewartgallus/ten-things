'use client';

import type { Id, Entry } from '@/lib';
import type { FreshListHandle, FreshItemHandle } from '@/ui';
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
    onDeselect(): void;
}

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

const Item = ({ entryAtId, onDeselect }: ItemProps) => {
    const ref = useRef<FreshItemHandle>(null);

    const { index, dragIndex, selectionId, item } = useFreshItem(ref);

    const id = item && item.id;

    const selected = selectionId === id;
    const isDragging = dragIndex !== undefined;
    const draggingMe = dragIndex === index;

    const onChange = useCallback((value: string) => ref.current!.change(value), []);
    const onComplete = useCallback(() => ref.current!.complete(), []);
    const onCreate = useCallback(() => ref.current!.create(), []);

    const onSelect = useCallback(() => ref.current!.select(), []);
    const onDragStart = iff(!isDragging,
                            useCallback(() => ref.current!.drag(), []));
    const onDrop = iff(isDragging && !draggingMe,
                       useCallback(() => ref.current!.drop(), []));

    const onToggle = onDragStart ?? onDrop;

    return <li role="listitem" className={styles.item}>
            <DropButton onDrop={onDrop} />
            <DragButton dragging={isDragging} onDragStart={onDragStart} onToggle={onToggle}>
                <div className={styles.grabberIcon}>&</div>
        </DragButton>
        {
            item ?
                <FreshEdit disabled={isDragging}
                    {...entryAtId(item.id)} selected={selected}
                    onChange={onChange}
                    onSelect={iff(!selected, onSelect)}
                    onDeselect={iff(selectionId !== undefined, onDeselect)}
                    onComplete={onComplete}
                /> :
            <FreshCreate disabled={isDragging} onCreate={onCreate} />
        }
        </li>;
};

const TenFresh = () => {
    const ref = useRef<TenHandle>(null);
    const { fresh, entryAtId, newEntryId } = useTen(ref);

    const onChangeId = useCallback((id: Id, value: string) => ref.current!.changeId(id, value), []);
    const onCreateIndex = useCallback((index: number) => ref.current!.createIndex(index), []);
    const onCompleteIndex = useCallback((index: number) => ref.current!.completeIndex(index), []);
    const onSwapIndices = useCallback((leftIndex: number, rightIndex: number) =>
        ref.current!.swapIndices(leftIndex, rightIndex), []);

    const fsh = useRef<FreshListHandle>(null);
    const onDeselect = useCallback(() => {
        fsh.current!.deselect();
    }, []);

    return <ul role="list" className={styles.list}>
            <FreshList
                ref={fsh}
                fresh={fresh} newEntryId={newEntryId}
                onSwapIndices={onSwapIndices}
                onChangeId={onChangeId} onCreateIndex={onCreateIndex} onCompleteIndex={onCompleteIndex}>
                <Item entryAtId={entryAtId} onDeselect={onDeselect} />
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
