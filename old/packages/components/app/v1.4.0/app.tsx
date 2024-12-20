import { Preferences } from '@capacitor/preferences'
import type { ColorScheme } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { sendOutput, sendSignal } from '@packages/port-send'
import systemLoaderAnimation from '@packages/system-loader-animation'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import type { CompProps } from './types'

function FallbackComponent({ error }: any) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: 'white',
				padding: 64,
			}}
		>
			<h2 style={{ color: 'red' }}>Системная ошибка!</h2>
			<h3>{error.message}</h3>
			<img
				src="error.jpg"
				style={{
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto',
					marginTop: 64,
					width: '50%',
				}}
			/>
		</div>
	)
}

export default forwardRef((props: CompProps, ref) => {
	const { project, projectVersion, projectDefaults, stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings()

	useEffect(() => {
		if (projectVersion) {
			Preferences.get({ key: 'projectVersion' }).then((r) => {
				if (!r.value) Preferences.set({ key: 'projectVersion', value: projectVersion })
				else if (projectVersion !== r.value) {
					Preferences.set({ key: 'projectVersion', value: projectVersion })
					window.location.reload()
				}
			})
		}
		if (stopLoaderAnimationOn === 'appInitialized') systemLoaderAnimation.stop()
	}, [])

	R.env.project = project
	R.env.projectVersion = projectVersion
	R.params.defaults = projectDefaults && eval(projectDefaults)?.[0]

	const { noodlNode, colorScheme: cs } = props

	const systemColorScheme = useColorScheme()
	const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
	R.params.colorScheme = colorScheme
	Noodl.Events.emit('colorSchemeChanged')

	useEffect(() => {
		if (cs === 'auto') setColorScheme(systemColorScheme)
		else {
			const savedColorScheme = localStorage.getItem('mantine-color-scheme') as ColorScheme | null
			setColorScheme(savedColorScheme || cs)
		}
	}, [cs, systemColorScheme])

	useImperativeHandle(
		ref,
		() => ({
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
		}),
		[cs, colorScheme, setColorScheme]
	)

	return (
		<ErrorBoundary FallbackComponent={FallbackComponent}>
			<div
				style={{
					width: '100%',
					height: '100%',
					backgroundColor: '#FFFFFF',
				}}
			>
				{props.children}
			</div>
		</ErrorBoundary>
	)
})
