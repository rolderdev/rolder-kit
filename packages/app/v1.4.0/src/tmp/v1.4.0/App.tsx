import { ColorScheme } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { Provider, createStore } from "jotai"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import BounceLoader from "react-spinners/BounceLoader"
import convertColor from "../../../../../utils/convertColor/v0.2.0/convertColor"
import { CompProps } from "../../../types"
import { deepMap } from "nanostores"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

const store = createStore()
export const hack = deepMap<{ [noodlNodeId: string]: boolean }>({})

export default forwardRef(function (props: CompProps, ref) {
    const { cookies } = window.R.libs
    const { project, projectVersion } = window.Noodl.getProjectSettings()

    if (projectVersion) {
        const cookieProjectVersion = cookies.get('projectVersion')
        if (!cookieProjectVersion) cookies.set('projectVersion', projectVersion)
        else if (projectVersion !== cookieProjectVersion) {
            cookies.set('projectVersion', projectVersion)
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

    return <div style={{ width: '100%', height: '100%', backgroundColor: convertColor(colorScheme === 'dark' ? 'dark.7' : 'gray.0') }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-30px', marginLeft: '-30px' }}>
            <BounceLoader
                color={props.appLoaderColor}
                loading={!backendInited}
            />
        </div>
        {window.R.env.project && <Provider store={store}>{props.children}</Provider>}
    </div>
})