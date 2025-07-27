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

    onDragEnd(): void;
    onDeselect(): void;
}

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

const Item = ({ entryAtId, onDeselect, onDragEnd }: ItemProps) => {
    const ref = useRef<FreshItemHandle>(null);

    const { index, dragIndex, selectionIndex, item } = useFreshItem(ref);

    const selected = selectionIndex === index;
    const isDragging = dragIndex !== undefined;
    const draggingMe = dragIndex === index;

    const onChange = useCallback((value: string) => ref.current!.change(value), []);
    const onComplete = useCallback(() => ref.current!.complete(), []);
    const onCreate = useCallback(() => ref.current!.create(), []);

    const onSelect = useCallback(() => ref.current!.select(), []);
    const onDragStart = iff(!isDragging,
                            useCallback(() => ref.current!.dragStart(), []));

    const onDrop = iff(isDragging && !draggingMe,
                       useCallback(() => ref.current!.drop(), []));

    return <li role="listitem" className={styles.item}>
            <DropButton onDrop={onDrop} />
            <DragButton dragging={isDragging}
                onDragStart={onDragStart}
                onDragEnd={iff(isDragging, onDragEnd)}>
                <div className={styles.grabberIcon}>&</div>
            </DragButton>
        {
            item ?
                <FreshEdit disabled={isDragging}
                    {...entryAtId(item.id)} selected={selected}
                    onChange={onChange}
                    onSelect={iff(!selected, onSelect)}
                    onDeselect={iff(selectionIndex !== undefined, onDeselect)}
                    onComplete={onComplete}
                /> :
            <FreshCreate disabled={isDragging} onCreate={onCreate} />
        }
        </li>;
};

const TenFresh = () => {
    const ref = useRef<TenHandle>(null);
    const { fresh, entryAtId, selectionIndex, dragIndex } = useTen(ref);

    const onCreateIndex = useCallback((index: number) => ref.current!.createIndex(index), []);

    const onChangeId = useCallback((id: Id, value: string) => ref.current!.changeId(id, value), []);
    const onCompleteIndex = useCallback((index: number) => ref.current!.completeIndex(index), []);

    const onSelectIndex = useCallback((index: number) => ref.current!.selectIndex(index), []);
    const onDeselect = useCallback(() => {
        ref.current!.deselect();
    }, []);

    const onDragEnd = useCallback(() => ref.current!.dragEnd(), []);

    const onDragStartIndex = useCallback((index: number) => ref.current!.dragStartIndex(index), []);
    const onDropIndex = useCallback((index: number) => ref.current!.dropIndex(index), []);

    return <ul role="list" className={styles.list}>
            <FreshList
                fresh={fresh} dragIndex={dragIndex}
                selectionIndex={selectionIndex}
                onSelectIndex={onSelectIndex}
                onChangeId={onChangeId}
                onCreateIndex={onCreateIndex}
                onCompleteIndex={onCompleteIndex}
                onDragStartIndex={onDragStartIndex}
                onDropIndex={onDropIndex}
                >
                <Item entryAtId={entryAtId} onDeselect={onDeselect} onDragEnd={onDragEnd} />
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
