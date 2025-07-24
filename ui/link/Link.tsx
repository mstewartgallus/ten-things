"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

type LinkProps = Parameters<typeof NextLink>[0];

const rmHref = ({ href, ...props }: LinkProps) => props;

// FIXME use usePathname to set aria-current="page" and remove href to
// deactivate link
export const Link = (props: LinkProps) => {
    const { href } = props;

    const pathname = usePathname();
    if (pathname !== href) {
        return <NextLink {...props} />;
    }

    return <a { ...rmHref(props) } aria-current="page" />;
};
