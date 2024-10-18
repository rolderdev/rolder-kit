import SpeedTest from '@cloudflare/speedtest'
import type { NoodlNode } from '@packages/node'
import { sendOutput } from '@packages/port-send'
import { onlineManager } from '@tanstack/react-query'
import { useState } from 'react'

const speedTest = new SpeedTest({
	measurements: [
		{ type: 'latency', numPackets: 3 },
		{ type: 'download', bytes: 0, count: 1 },
		{ type: 'upload', bytes: 1e1, count: 1 },
	],
	autoStart: false,
})

const reconnection = {
	active: false,
	count: 0,
}

function setOnlineHandler(noodlNode: NoodlNode) {
	reconnection.active = false
	onlineManager.setOnline(true)
	//@ts-ignore
	sendOutput(noodlNode, 'isOnline', true)
}

function setOfflineHandler(noodlNode: NoodlNode) {
	reconnection.active = true
	reconnection.count = 0

	onlineManager.setOnline(false)
	//@ts-ignore
	sendOutput(noodlNode, 'isOnline', false)

	R.libs.queryClient?.cancelQueries()
}

const timeout = (promise: any, timeout: number) => Promise.race([promise, new Promise((_r, rej) => setTimeout(rej, timeout))])

let retry = 1
function invalidateQueriesWithRetries(maxRetries: number, retryTimeout: number) {
	if (retry >= maxRetries) retry = 1
	else
		timeout(R.libs.queryClient?.invalidateQueries(), retryTimeout)
			.then(() => (retry = 1))
			.catch(() => {
				retry++
				R.libs.queryClient?.cancelQueries().then(() => invalidateQueriesWithRetries(maxRetries, retryTimeout))
				log.info('invalidateQueriesWithRetries retry:', retry)
			})
}

export default function (noodlNode: NoodlNode, offlineLatancy: number, offlineJitter: number, offlineDownload: number) {
	const [isOnline, setOnline] = useState(false)

	if (!speedTest.onFinish)
		speedTest.onFinish = (r) => {
			const { latency, jitter, download, upload } = r.getSummary()

			//@ts-ignore
			sendOutput(noodlNode, 'network', {
				latency: latency || 0,
				jitter: jitter || 0,
				download: download || 0,
				upload: upload || 0,
			})
			log.info('Network state', { latency: latency || 0, jitter: jitter || 0, download: download || 0, upload: upload || 0 })

			if (latency && download && jitter) {
				const online = latency < offlineLatancy && jitter < offlineJitter && download > offlineDownload
				if (online) {
					if (reconnection.active && reconnection.count >= 3 && !isOnline) {
						setOnlineHandler(noodlNode)
						setOnline(true)

						const mc = R.libs.queryClient?.getMutationCache().getAll()
						if (mc && mc.length === mc.filter((i) => i.state.status === 'success').length) invalidateQueriesWithRetries(5, 2000)
					}

					if (reconnection.active) {
						reconnection.count++
						log.info('Network reconnection count', reconnection.count)
					} else if (!isOnline) {
						setOnlineHandler(noodlNode)
						setOnline(true)
					}
				} else if (!reconnection.active) {
					setOfflineHandler(noodlNode)
					setOnline(false)
				}
			} else {
				if (isOnline) {
					setOfflineHandler(noodlNode)
					setOnline(false)
				}
			}
		}

	if (!speedTest.onError)
		speedTest.onError = () => {
			if (isOnline) {
				setOfflineHandler(noodlNode)
				setOnline(false)
			}
		}

	const measureNetwork = () => {
		if (!speedTest.isFinished && !speedTest.isRunning) speedTest.play()
		else if (speedTest.isFinished) speedTest.restart()
		else {
			setOfflineHandler(noodlNode)
			setOnline(false)
		}
	}

	return { isOnline, measureNetwork }
}
