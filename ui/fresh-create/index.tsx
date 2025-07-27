"use client";

import type { Entry, Fresh, Id } from "@/lib";
import { useActionState, useEffect, useId } from 'react';
import { Button } from "../button";
import { Icon } from "../icon";

import styles from "./FreshCreate.module.css";

interface Props {
    disabled: boolean;
    onCreate?: () => void;
}

export const FreshCreate = ({ disabled, onCreate }: Props) => {
    const id = useId();
    return <div className={styles.create}>
        <form className={styles.form} id={id} action={onCreate}>
            <Button disabled={disabled} aria-label="Create Thing" value="create">
                <Icon>+</Icon>
            </Button>
         </form>
        <>...</>
        </div>;
};
