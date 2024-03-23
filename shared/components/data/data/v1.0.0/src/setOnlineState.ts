import { NoodlNode } from "@shared/node"
import { sendOutput } from "@shared/port-send"
import { onlineManager } from "@tanstack/react-query"

export default async function (noodlNode: NoodlNode) {
    //@ts-ignore
    const connectionApi = navigator.connection
    let online = navigator.onLine
    if (connectionApi) online = navigator.onLine && connectionApi.effectiveType === '4g'

    if (online) {
        await R.libs.Kuzzle?.connect()
        const mc = R.libs.queryClient?.getMutationCache().getAll()
        if (mc && mc.length === mc.filter(i => i.state.status === 'success').length)
            setTimeout(() => R.libs.queryClient?.invalidateQueries(), 500)
    }

    onlineManager.setOnline(online)
    //@ts-ignore
    sendOutput(noodlNode, 'isOnline', online)
    //@ts-ignore
    sendOutput(noodlNode, 'network', {
        type: connectionApi.type,
        effectiveType: connectionApi.effectiveType,
        downlink: connectionApi.downlink,
        rtt: connectionApi.rtt
    })

    log.info('Network chganged', { connectionApi, online })
}