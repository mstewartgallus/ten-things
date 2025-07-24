import type { ComponentType } from "react";

export const componentName = <T>(Component: ComponentType<T>) => {
    if (typeof Component === 'string') {
        return Component;
    }
    const name = Component.displayName ?? Component.name;
    return name;
};
