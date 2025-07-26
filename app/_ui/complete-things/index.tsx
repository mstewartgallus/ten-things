'use client';

import { useRef } from 'react';

import type { TenHandle } from "@/lib";
import { useTen } from "@/lib";

import { CompleteList } from '@/ui';

export const CompleteThings = () => {
    const ref = useRef<TenHandle>(null);

    const { entryAtId, complete } = useTen(ref);

    return <CompleteList complete={complete} entryAtId={entryAtId} />;
};
