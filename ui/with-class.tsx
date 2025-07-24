import type {
    ForwardedRef, PropsWithoutRef,
    ComponentType, DetailedHTMLProps, HTMLAttributes, ReactElement
} from "react";
import { forwardRef } from "react";
import { componentName } from "./component-name";

const j = (x: string, y: string) => [x, y].join(' ');

interface Props<T> {
    className?: string;
    ref?: ForwardedRef<T>;
}

// type WithClass = <T extends ComponentType<unknown>,>(Component: T, className: string) => WithClassExoticComponent<T>;

const withClassImpl = <T, P extends Props<T>>(
    Component: ComponentType<PropsWithoutRef<P> & { ref: ForwardedRef<T>}>,
    className: string
) =>
    forwardRef<T, P>((props, ref) => {
          const clazz = props.className ?? '';
          const theClass = j(clazz, className);
          return <Component {...props} className={theClass} ref={ref} />;
      });

// FIXME awkward
// doesn't handle CSS conflicts
export const withClass  = <T, P extends Props<T>>(
    Component: ComponentType<PropsWithoutRef<P> & { ref: ForwardedRef<T>}>,
    className: string
) => {
    const Classy = withClassImpl<T, P>(Component, className);
    const name = componentName(Component);
    Classy.displayName = `.${className}(${name})`;
    return Classy;
};
