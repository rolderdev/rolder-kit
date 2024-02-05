import { ColorScheme } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { CompProps } from "./types"
import convertColor from "@shared/convertColor"
import { sendOutput, sendSignal } from '@shared/port-send'
import React from "react"

export default forwardRef(function (props: CompProps, ref) {
  const { project, projectVersion, projectDefaults } = Noodl.getProjectSettings()

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

  R.env.project = project
  R.env.projectVersion = projectVersion
  R.params.defaults = projectDefaults && eval(projectDefaults)?.[0]

  const { noodlNode, colorScheme: cs } = props

  let systemColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  R.params.colorScheme = colorScheme
  Noodl.Events.emit("colorSchemeChanged")

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
    {props.children}
  </div>
})