import { Aside, useMantineTheme } from "@mantine/core"
import { forwardRef } from "react"
import { useMediaQuery, useShallowEffect } from "@mantine/hooks"
import { atom, useSetAtom, useAtomValue } from 'jotai';
import { headerHeightAtom } from "../../../../header/fabricVesrions/v0.1.0/v0.1.0/Header";
import { appShellPropsAtom, asideOffsetAtom } from "../../../../fabricVesrions/v0.1.0/v0.2.0/AppShell";

export const asidePropsAtom = atom({
    hiddenBreakpoint: undefined,
    respHide: false
});

export default forwardRef(function (props: any) {
    const setAsideOffset = useSetAtom(asideOffsetAtom)
    const setAsideProps = useSetAtom(asidePropsAtom)
    useShallowEffect(() => {
        setAsideOffset(props.asideOffsetBreakpoint)
        setAsideProps({
            respHide: props.asideRespHide,
            hiddenBreakpoint: props.asideHiddenBreakpoint
        })
    }, [props])

    const appShellProps = useAtomValue(appShellPropsAtom)
    const headerHeight = useAtomValue(headerHeightAtom)
    const theme = useMantineTheme();
    const hidden = useMediaQuery(
        `(max-width: ${theme.breakpoints[props.asideHiddenBreakpoint ? props.asideHiddenBreakpoint : '0em']})`)

    return (
        <Aside
            {...props}
            withBorder={props.asideWithBorder}
            width={props.asideWidth}
            hiddenBreakpoint={props.asideHiddenBreakpoint}
            hidden={props.asideRespHide}
            sx={appShellProps.layout === 'alt' ? { top: props.asideRespHide && hidden ? headerHeight : 0 } : {}}
        >
            {props.children}
        </Aside >
    )
})