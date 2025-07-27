import type { Entry } from "@/lib/definitions";

import { EditFormMaybe } from "../edit-form-maybe";
import { Time } from "../time";

type Props = Entry & {
    disabled: boolean;
    onChange?: (value: string) => void;
    onSelect?: () => void;
    onDeselect?: () => void;
}

export const EntryEdit = ({
    disabled, value, created,
    onChange, onSelect, onDeselect
}: Props) =>
    <div>
        <EditFormMaybe value={value} disabled={disabled}
            onChange={onChange} onSelect={onSelect} onDeselect={onDeselect} />
        <div>Created: <Time>{created}</Time></div>
    </div>;
