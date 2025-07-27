import type { Entry } from "@/lib/definitions";

import { EditFormMaybe } from "../edit-form-maybe";
import { Time } from "../time";

type Props = Entry & {
    disabled: boolean;
    changeAction?: (value: string) => void;
    selectAction?: () => void;
    deselectAction?: () => void;
}

export const EntryEdit = ({
    disabled, value, created,
    changeAction, selectAction, deselectAction
}: Props) =>
    <div>
        <EditFormMaybe value={value} disabled={disabled}
            changeAction={changeAction} selectAction={selectAction} deselectAction={deselectAction} />
        <div>Created: <Time>{created}</Time></div>
    </div>;
