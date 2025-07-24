import type { JSX } from "react";
import { useWrap, toDataProps } from "../wrap";
import { withClass } from "../with-class";

import styles from "./Button.module.css";

type Props = JSX.IntrinsicElements["body"];

const RawButton = withClass<HTMLBodyElement, Props>('button', styles.button);

export const Button = ({children, ...props}: Props) => {
    const { state, hooks } = useWrap();
    return <div className={styles.buttonWrapper} {...hooks}>
        <RawButton {...props} {...toDataProps(state)}>
            {children}
        </RawButton>
    </div>;
};
