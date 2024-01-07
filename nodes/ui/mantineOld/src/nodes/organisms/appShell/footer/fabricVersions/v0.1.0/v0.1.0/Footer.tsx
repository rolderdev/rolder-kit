import { Footer } from "@mantine/core"
import { forwardRef } from "react"
import { atom, useSetAtom } from 'jotai';
import { useResizeObserver, useShallowEffect } from "@mantine/hooks";

export const footerHeightAtom = atom(0)

export default forwardRef(function (props: any) {
    const setFooterHeight = useSetAtom(footerHeightAtom)
    const [ref, rect] = useResizeObserver()
    useShallowEffect(() => setFooterHeight(props.footerWithBorder ? rect.height + 1 : rect.height), [rect.height])

    return (
        <Footer
            {...props}
            withBorder={props.footerWithBorder}
            height={props.footerHeight}
            ref={ref}
        >
            {props.children}
        </Footer>
    )
})