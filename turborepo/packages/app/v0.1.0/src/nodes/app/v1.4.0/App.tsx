import { ColorScheme } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import BounceLoader from "react-spinners/BounceLoader"
import { CompProps } from "./types"
import { deepMap } from "nanostores"
//@ts-ignore
import Cookies from 'js-cookies'
import { sendOutput, sendSignal } from "@rk/node-fabrik"
import { Provider } from "@rk/jotai"
import { convertColor3 } from '@rk/utils'

export const hack = deepMap<{ [noodlNodeId: string]: boolean }>({})

export default forwardRef(function (props: CompProps, ref) {
    const { project, projectVersion } = window.Noodl.getProjectSettings()

    if (projectVersion) {
        const cookieProjectVersion = Cookies.get('projectVersion')
        if (!cookieProjectVersion) Cookies.set('projectVersion', projectVersion)
        else if (projectVersion !== cookieProjectVersion) {
            Cookies.set('projectVersion', projectVersion)
            window.location.reload()
        }
    }

    window.R.env.project = project
    window.R.env.projectVersion = projectVersion
    window.R.params.defaults = props.projectDefaults

    const [backendInited, setBackendInited] = useState(false)

    window.Noodl.Events.on("backendInited", () => setBackendInited(true))

    const { noodlNode, colorScheme2: cs } = props

    let systemColorScheme = useColorScheme()
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
    window.R.params.colorScheme = colorScheme
    window.Noodl.Events.emit("colorSchemeChanged")

    useEffect(() => {
        if (cs === 'auto') setColorScheme(systemColorScheme)
        else {
            const savedColorScheme = localStorage.getItem('mantine-color-scheme') as ColorScheme | null
            setColorScheme(savedColorScheme || cs)
        }
    }, [cs, systemColorScheme])

    useImperativeHandle(ref, () => ({
        setColorScheme() {
            if (cs !== 'auto') {
                if (!hack.get()[noodlNode.id]) hack.setKey(noodlNode.id, true)
                else {
                    setColorScheme(cs)
                    localStorage.setItem('mantine-color-scheme', cs)
                    sendOutput(noodlNode, 'colorScheme2', cs)
                    setTimeout(() => sendSignal(noodlNode, 'colorSchemeChanged'))
                    hack.setKey(noodlNode.id, false)
                }
            }
        },
        toggleColorScheme() {
            if (cs !== 'auto') {
                if (!hack.get()[noodlNode.id]) hack.setKey(noodlNode.id, true)
                else {
                    const c = colorScheme === 'light' ? 'dark' : 'light'
                    setColorScheme(c)
                    localStorage.setItem('mantine-color-scheme', c)
                    sendOutput(noodlNode, 'colorScheme2', c)
                    setTimeout(() => sendSignal(noodlNode, 'colorSchemeChanged'))
                    hack.setKey(noodlNode.id, false)
                }
            }
        },
    }), [cs, colorScheme, setColorScheme])

    return <div style={{ width: '100%', height: '100%', backgroundColor: convertColor3(colorScheme === 'dark' ? 'dark.7' : 'gray.0') }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-30px', marginLeft: '-30px' }}>
            <BounceLoader
                color={props.appLoaderColor}
                loading={!backendInited}
            />
        </div>
        {window.R.env.project && <Provider>{props.children}</Provider>}
    </div>
})