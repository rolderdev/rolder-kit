import { ColorScheme } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
//import { Provider, createStore } from "jotai"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import BounceLoader from "react-spinners/BounceLoader"
import { CompProps } from "./types"
import convertColor from "@shared/convertColor"
import { sendOutput, sendSignal } from '@shared/port-send'
import React from "react"

//const store = createStore()

export default forwardRef(function (props: CompProps, ref) {
  const { project, projectVersion, projectDefaults } = window.Noodl.getProjectSettings()

  useEffect(() => {
    if (projectVersion) {
      const savedProjectVersion = localStorage.getItem('projectVersion')
      if (!savedProjectVersion) localStorage.setItem('projectVersion', projectVersion)
      else if (projectVersion !== savedProjectVersion) {
        localStorage.setItem('projectVersion', projectVersion)
        window.location.reload()
      }
    }
  }, [])

  window.R.env.project = project
  window.R.env.projectVersion = projectVersion
  window.R.params.defaults = projectDefaults && eval(projectDefaults)?.[0]

  const [backendInited, setBackendInited] = useState(false)
  window.Noodl.Events.on("backendInited", () => setBackendInited(true))

  const { noodlNode, colorScheme: cs } = props

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
        setColorScheme(cs)
        localStorage.setItem('mantine-color-scheme', cs)
        sendOutput(noodlNode, 'colorScheme', cs)
        sendSignal(noodlNode, 'colorSchemeChanged')
      }
    },
    toggleColorScheme() {
      if (cs !== 'auto') {
        const c = colorScheme === 'light' ? 'dark' : 'light'
        setColorScheme(c)
        localStorage.setItem('mantine-color-scheme', c)
        sendOutput(noodlNode, 'colorScheme', c)
        sendSignal(noodlNode, 'colorSchemeChanged')
      }
    },
  }), [cs, colorScheme, setColorScheme])

  return <div style={{ width: '100%', height: '100%', backgroundColor: convertColor(colorScheme === 'dark' ? 'dark.7' : 'gray.0') }}>
    {props.appLoader
      ? <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-30px', marginLeft: '-30px' }}>
        <BounceLoader
          color={props.appLoaderColor}
          loading={!backendInited}
        />
      </div>
      : (!props.appLoader || backendInited) && props.children}
  </div>
})

//{window.R.env.project && <Provider store={store}>{props.children}</Provider>}