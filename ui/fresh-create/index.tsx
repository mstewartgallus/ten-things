import type { Entry, Fresh, Id } from "@/lib";

import { CreateForm } from "../slot-controls";

import styles from "./FreshCreate.module.css";

interface Props {
    disabled: boolean;
    onCreate?: () => void;
}

export const FreshCreate = ({ disabled, onCreate }: Props) =>
    <div className={styles.create}>
        <CreateForm disabled={disabled} onCreate={onCreate} />
        <>...</>
    </div>;
