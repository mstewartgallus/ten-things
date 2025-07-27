import type {
    ElementType,
    ComponentType
} from "react";
import { createElement } from "react";
import { componentName } from "./component-name";

const j = (x: string, y: string) => [x, y].join(' ');

interface Props<T> {
    className?: string;
}

const withClassImpl: <T, P extends Props<T>>(
    Component: ElementType<P>,
    className: string
) => ComponentType<P> = <T, P extends Props<T>>(
    Component: ElementType<P>,
    className: string
) => (props: P) => {
    const clazz = props.className ?? '';
    const theClass = j(clazz, className);
    return createElement(Component, {
        ...props,
        className: theClass
    });
};

export const withClass = <T, P extends Props<T>>(
    Component: ElementType<P>,
    className: string
) => {
    const Classy = withClassImpl<T, P>(Component, className);
    const name = componentName(Component);
    Classy.displayName = `.${className}(${name})`;
    return Classy;
};
