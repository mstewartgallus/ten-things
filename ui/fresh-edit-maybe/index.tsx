import type { Entry, Fresh, Id } from "@/lib";

import { FreshCreate } from "../fresh-create";
import { FreshEdit } from "../fresh-edit";

interface Props {
    disabled: boolean;
    item?: Fresh;
    selectionId?: Id;
    entryAtId: (id: Id) => Entry;

    onChangeId?: (id: Id, value: string) => void;
    onSelectId: (id: Id) => void;
    onDeselect: () => void;

    onCreate?: () => void;
    onComplete?: () => void;
}

export const FreshEditMaybe = ({
    disabled,
    item,
    selectionId,
    entryAtId,

    onChangeId, onSelectId, onDeselect,

    onCreate, onComplete
}: Props) => {
    if (!item) {
        return <FreshCreate disabled={disabled} onCreate={onCreate} />;
    }
    return <FreshEdit disabled={disabled} id={item.id} selectionId={selectionId} entryAtId={entryAtId}
        onChangeId={onChangeId} onSelectId={onSelectId} onDeselect={onDeselect}
        onComplete={onComplete}/>;
};
