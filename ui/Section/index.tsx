import type { JSX, ReactNode } from "react";
import { useId } from "react";

import styles from "./Section.module.css";

type Props = JSX.IntrinsicElements['section'] & {
    readonly header: ReactNode;
};

const Section = ({ header, children, ...props }: Props) => {
    const headerId = useId();
    return <section aria-labelledby={headerId} {...props}>
        <div className={styles.header} id={headerId}>
            {header}
        </div>
        {children}
    </section>;
};

export default Section;
