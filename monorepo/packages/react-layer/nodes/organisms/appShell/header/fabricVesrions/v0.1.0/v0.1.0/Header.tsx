import { Burger, Header, MediaQuery } from "@mantine/core"
import { forwardRef } from "react"
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { navbarPropsAtom } from "../../../../navbar/fabricVesrions/v0.1.0/v0.1.0/Navbar";
import { useResizeObserver, useShallowEffect } from "@mantine/hooks";

export const navbarOpenedAtom = atom(false)
const handleNavbarOpenedAtom = atom(null, (get, set) => {
    set(navbarOpenedAtom, !get(navbarOpenedAtom))
})
export const headerHeightAtom = atom(0)

export default forwardRef(function (props: any) {
    const navbarProps = useAtomValue(navbarPropsAtom)
    const navbarOpened = useAtomValue(navbarOpenedAtom)
    const toggleNavbarOpened = useSetAtom(handleNavbarOpenedAtom)
    const setHeaderHeight = useSetAtom(headerHeightAtom)
    const [ref, rect] = useResizeObserver()
    useShallowEffect(() => setHeaderHeight(props.headerWithBorder ? rect.height + 1 : rect.height), [rect.height])

    return (
        <Header
            {...props}
            withBorder={props.headerWithBorder}
            height={props.headerHeight}
            ref={ref}
        >
            {navbarProps.respHide &&
                <MediaQuery largerThan={navbarProps.hiddenBreakpoint} styles={{ display: 'none' }}>
                    <Burger
                        opened={navbarOpened}
                        onClick={() => toggleNavbarOpened()}
                        size={props.burgerSize}
                    />
                </MediaQuery>}
            {props.children}
        </Header>
    )
})