import type { Entry } from "@/lib/definitions";

import { EditFormMaybe } from "../edit-form-maybe";
import { Time } from "../time";

type Props = Entry & {
    onChange?: (value: string) => void;
    onSelect?: () => void;
    onDeselect?: () => void;
}

export const EntryEdit = ({
    value, created,
    onChange, onSelect, onDeselect
}: Props) =>
    <div>
        <EditFormMaybe value={value}
            onChange={onChange} onSelect={onSelect} onDeselect={onDeselect} />
        <div>Created: <Time>{created}</Time></div>
    </div>;
