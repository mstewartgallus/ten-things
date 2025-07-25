'use client';

import type { JSX } from "react";
import { useWrap, toDataProps } from "../wrap";
import { withClass } from "../with-class";

import styles from "./Button.module.css";

type Props = JSX.IntrinsicElements["button"];

const RawButton = withClass<HTMLButtonElement, Props>('button', styles.button);

export const Button = ({children, ...props}: Props) => {
    const { state, hooks } = useWrap();
    return <div className={styles.buttonWrapper} {...hooks}>
        <RawButton {...props} {...toDataProps(state)}>
            {children}
        </RawButton>
    </div>;
};
