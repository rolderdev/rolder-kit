import { Navbar, useMantineTheme } from "@mantine/core"
import { forwardRef } from "react"
import { useMediaQuery, useShallowEffect } from "@mantine/hooks"
import { atom, useSetAtom, useAtomValue } from 'jotai';
import { headerHeightAtom, navbarOpenedAtom } from "../../../../header/fabricVesrions/v0.1.0/v0.1.0/Header";
import { appShellPropsAtom, navbarOffsetAtom } from "../../../../fabricVesrions/v0.1.0/v0.2.0/AppShell";

export const navbarPropsAtom = atom({
    hiddenBreakpoint: undefined,
    respHide: false
});

export default forwardRef(function (props: any) {
    const setNavbarOffset = useSetAtom(navbarOffsetAtom)
    const setNavbarProps = useSetAtom(navbarPropsAtom)
    useShallowEffect(() => {
        setNavbarOffset(props.navbarOffsetBreakpoint)
        setNavbarProps({
            respHide: props.navbarRespHide,
            hiddenBreakpoint: props.navbarHiddenBreakpoint
        })
    }, [props])

    const appShellProps = useAtomValue(appShellPropsAtom)
    const headerHeight = useAtomValue(headerHeightAtom)
    const navbarOpened = useAtomValue(navbarOpenedAtom)
    const theme = useMantineTheme();
    const hidden = useMediaQuery(
        `(max-width: ${theme.breakpoints[props.navbarHiddenBreakpoint ? props.navbarHiddenBreakpoint : '0em']})`)

    return (
        <Navbar
            {...props}
            withBorder={props.navbarWithBorder}
            width={props.navbarWidth}
            hiddenBreakpoint={props.navbarHiddenBreakpoint}
            hidden={props.navbarRespHide ? !navbarOpened : false}
            sx={appShellProps.layout === 'alt' ? { top: props.navbarRespHide && hidden ? headerHeight : 0 } : {}}
        >
            {props.children}
        </Navbar >
    )
})