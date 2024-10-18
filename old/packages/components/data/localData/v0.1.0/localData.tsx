import { sendOutput, sendSignal } from '@packages/port-send'
import systemLoaderAnimation from '@packages/system-loader-animation'
import map from 'just-map-object'
import { forwardRef, useEffect, useState } from 'react'
import initDataDb from './src/initDataDb'
import type { Props } from './types'

let sended = false

export default forwardRef((props: Props) => {
	const { dbName, backendDevMode, backendHost, collectionsDefinition } = props
	const { project, environment = 'd2', stopLoaderAnimationOn = 'authInitialized' } = Noodl.getProjectSettings()

	R.env.dbName = dbName

	const [backendInited, setBackendInited] = useState(false)

	R.db?.addState('replication').then((replication: any) => {
		const store = replication.$

		store.subscribe((states: Record<string, boolean>) => {
			let replicationCollectionsCount = 0
			map(collectionsDefinition, (_, collectionDefinition) => {
				if (collectionDefinition.replication !== false) replicationCollectionsCount++
			})
			const initedCount = Object.values(states).filter((i) => i === true).length
			// should run once
			if (replicationCollectionsCount === initedCount && !sended) {
				sendOutput(props.noodlNode, 'replicating', false)
				sendSignal(props.noodlNode, 'replicated')
				sended = true
			} else sendOutput(props.noodlNode, 'replicating', true)
		})
	})

	useEffect(() => {
		if (!project || !dbName) {
			log.error('Backend init error: empty required props.', { project, environment, dbName })
			R.libs.mantine?.MantineError?.('Системная ошибка!', `Backend init error: empty required props.`)
			return
		}

		initDataDb(collectionsDefinition, { environment, backendDevMode, backendHost }).then(() => {
			setBackendInited(true)
			if (stopLoaderAnimationOn === 'localDataInitialized') systemLoaderAnimation.stop()
		})
	}, [])

	return <>{backendInited ? props.children : null}</>
})
