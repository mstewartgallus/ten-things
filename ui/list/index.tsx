'use client';

import type { Key, ReactNode } from 'react';
import { createContext, useContext } from 'react';

const ItemContext = createContext<number>(0);
ItemContext.displayName = 'ItemContext';

interface ItemProps {
    readonly children: ReactNode;
}

export const useItem = () => useContext(ItemContext);

interface Props {
    children: ReactNode;
    length: number;
    keyAt: (index: number) => Key;
}

export const List = ({ children, keyAt, length }: Props) =>
    Array(length).fill(null).map((x, index) =>
        <ItemContext key={keyAt(index)} value={index}>
             {children}
    </ItemContext>);
