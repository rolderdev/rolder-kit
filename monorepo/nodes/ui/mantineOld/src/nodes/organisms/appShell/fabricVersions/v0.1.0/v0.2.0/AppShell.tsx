import { AppShell } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { forwardRef, useState } from "react"
import { atom, useAtomValue, useSetAtom } from 'jotai';

type Comps = { [x: string]: any }
export const navbarOffsetAtom = atom(undefined)
export const asideOffsetAtom = atom(undefined)
export const appShellPropsAtom = atom({ layout: 'default' })

export default forwardRef(function (props: any) {
    const { flush } = window.R.libs.just

    const setAppShellProps = useSetAtom(appShellPropsAtom);

    const [comps, setComps] = useState<Comps>()
    useShallowEffect(() => {
        setAppShellProps({ layout: props.appShellLayout })

        const compNames = ['Navbar', 'Header', 'Aside', 'Footer']
        const children = Array.isArray(props.children) ? props.children : [props.children]
        if (flush(children)?.length) {
            let comps: Comps = { content: [] }
            children.forEach((child: any) => {
                const compName: string = child.props.noodlNode.model.type.split('.')[1]
                if (compNames.includes(compName)) comps[compName] = child
                else comps.content.push(child)
            })
            setComps(comps)
        } else setComps({})
    }, [props])

    const navbarOffset = useAtomValue(navbarOffsetAtom)
    const asideOffset = useAtomValue(navbarOffsetAtom)

    return (<AppShell
        opacity={props.opacity}
        layout={props.appShellLayout}
        hidden={props.hiddenAppShell}
        padding={props.appShellCustomPadding ? props.appShellCustomPadding : props.appShellPadding}
        navbarOffsetBreakpoint={navbarOffset}
        asideOffsetBreakpoint={asideOffset}
        navbar={comps?.Navbar ? comps?.Navbar : undefined}
        header={comps?.Header ? comps?.Header : undefined}
        aside={comps?.Aside ? comps.Aside : undefined}
        footer={comps?.Footer ? comps.Footer : undefined}
    >
        {comps?.content}
    </AppShell >)
})