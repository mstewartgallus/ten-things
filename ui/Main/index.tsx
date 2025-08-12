import type { JSX } from "react";

import { useId } from "react";
import { MainContextProvider } from "../main-label";
import { withClass } from "../with-class";
import styles from "./Main.module.css";

type Props = JSX.IntrinsicElements['main'];

const RawMain = withClass<Props>('main', styles.main);

const Main = ({ children, ...props }: Props) => {
    const id = useId();
    return <RawMain aria-labelledby={id} {...props}>
        <MainContextProvider value={id}>
           {children}
        </MainContextProvider>
        </RawMain>;
};

export default Main;
