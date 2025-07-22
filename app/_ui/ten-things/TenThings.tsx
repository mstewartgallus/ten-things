"use client";

import { Suspense, useMemo } from 'react';
import { FreshList } from '@/ui/fresh-list/FreshList';
import {
    useFresh,
    useEntryAtId,
    useNewEntryId,
    useOnChangeId,
    useOnCreateIndex,
    useOnCompleteIndex,
    useOnSwapIndices
} from '../hooks';

const useFreshCount = () => {
    const fresh = useFresh();
    return useMemo(() => fresh.reduce((x, y) => (y != null ? 1 : 0) + x, 0),
            [fresh]);
};

const Heading = () => {
    const count = useFreshCount();
    return <>{count} / 10 Things</>
};

const FallbackHeading = () =>
    <>? / 10 Things</>;

const List = () => {
    const fresh = useFresh();
    const entryAtId = useEntryAtId();
    const newEntryId = useNewEntryId();

    const onChangeId = useOnChangeId();
    const onCreateIndex = useOnCreateIndex();
    const onCompleteIndex = useOnCompleteIndex();
    const onSwapIndices = useOnSwapIndices();

    return <FreshList
                 entryAtId={entryAtId}
                 fresh={fresh}
                 newEntryId={newEntryId}

                 onChangeId={onChangeId}

                 onCreateIndex={onCreateIndex}
                 onCompleteIndex={onCompleteIndex}
                 onSwapIndices={onSwapIndices}

        />;
};

export const TenThings = () =>
    <section>
       <h1>
          <Suspense fallback={<FallbackHeading />}>
             <Heading />
          </Suspense>
       </h1>
       <Suspense>
          <List />
       </Suspense>
    </section>;
