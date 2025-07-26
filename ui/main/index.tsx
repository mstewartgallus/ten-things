import type { JSX } from "react";

import { useId } from "react";
import { MainContextProvider } from "../main-label";

type Props = JSX.IntrinsicElements['main'];

export const Main = ({ children, ...props }: Props) => {
    const id = useId();
    return <main aria-labelledby={id} {...props}>
        <MainContextProvider value={id}>
           {children}
        </MainContextProvider>
        </main>;
};
