'use client';

import type { EntryId, TenHandle, FreshHandle, EntryHandle } from '@/lib';

import { useCallback, useRef } from 'react';
import { DragButton, DropButton, MainLabel,
         FreshEdit,
         List, useItem,
         H1, Header } from '@/ui';
import { useTen, useFresh, useEntry } from '@/lib';

import styles from './TenThings.module.css';

const iff = <T,>(cond: boolean, val: T) => cond ? val : undefined;

const useFreshCount = () => {
    const ref = useRef<TenHandle>(null);
    const { freshNonNull } = useTen(ref);
    return freshNonNull;
};

const Heading = () => {
    const count = useFreshCount();
    return <>{count} / 10 Things</>
};


interface EntryProps {
    id: EntryId;
    disabled: boolean;
    selected: boolean;
    completeAction?: () => Promise<void>;
    toggleAction?: () => Promise<void>;
}

const Entry = ({
    id, disabled, selected,
    toggleAction, completeAction
}: EntryProps) => {
    const entryRef = useRef<EntryHandle>(null);
    const entry = useEntry(entryRef, id);

    const changeAction = useCallback(async (value: string) => await entryRef.current!.change(value), []);

    return <FreshEdit disabled={disabled}
                    entry={entry}
                    selected={selected}
                    changeAction={changeAction}
                    toggleAction={toggleAction}
                    completeAction={completeAction}
        />;
};


interface MaybeEntryProps {
    id?: EntryId;
    disabled: boolean;
    selected: boolean;
    createAction?: (value: string) => Promise<void>;
    completeAction?: () => Promise<void>;
    toggleAction?: () => Promise<void>;
}

const MaybeEntry = ({
    id,
    createAction, completeAction,
    ...props
}: MaybeEntryProps) => {
    if (id === undefined) {
        return <FreshEdit changeAction={createAction} {...props} />;
    }
    return <Entry id={id} completeAction={completeAction} {...props} />;
};

interface ItemProps {
    anyDragging: boolean;
    deselectAction?: () => Promise<void>;
}

const Item = ({ anyDragging, deselectAction }: ItemProps) => {
    const index = useItem();
    const fsh = useRef<FreshHandle>(null);
    const { item, selected, dragging } = useFresh(fsh, index);

    const completeAction = useCallback(async () => await fsh.current!.complete(), []);
    const createAction = useCallback(async (value: string) => await fsh.current!.create(value), []);

    const selectAction = useCallback(async () => await fsh.current!.select(), []);
    const dragStartAction = useCallback(async () => await fsh.current!.drag(), []);
    const dropAction = iff(anyDragging && !dragging,
                       useCallback(async () => await fsh.current!.drop(), []));

    const id = (item && item.id) ?? undefined;

    const toggleAction = iff(!selected, selectAction) ?? deselectAction;

    return <li role="listitem" className={styles.item}>
            <DropButton action={dropAction} />
            <DragButton dragging={dragging} dragStartAction={dragStartAction}>
                <div className={styles.grabberIcon}>&</div>
            </DragButton>
            <MaybeEntry disabled={dragging}
                    id={id} selected={selected}
                    createAction={createAction}
                    toggleAction={toggleAction}
                    completeAction={completeAction}
                />
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
