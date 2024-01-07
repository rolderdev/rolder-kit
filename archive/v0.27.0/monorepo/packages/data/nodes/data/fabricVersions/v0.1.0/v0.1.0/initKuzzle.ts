import { dbClassVersion } from "../../../../../utils/getVersion/v0.5.0/getVersion"
import { sendOutput } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { log, time } from "../../../../../../../utils/debug/log/v0.2.0/log"
import validateJwt from "../../../../../../mantine/utils/validateJwt/v0.3.0/validateJwt"
import { Kuzzle, WebSocket } from 'kuzzle-sdk'

export default async function (noodlNode: NoodlNode) {
    const { project, backendVersion, dbName } = window.R.env

    const kuzzle = new Kuzzle(
        new WebSocket(`${project}.kuzzle.${backendVersion}.rolder.app`, { port: 443 })
    )
    window.R.libs.Kuzzle = kuzzle

    await kuzzle.connect()
    const jwtValid = await validateJwt()
    if (jwtValid && dbName) {
        await kuzzle.document.search('config', 'dbclass_v1', {}, { size: 100 }).then((r) => {
            const dbClasses: any = {}
            r.hits.map(i => { dbClasses[i._source.name] = i._source })
            window.R.dbClasses = dbClasses
        })
        const user = await kuzzle.auth.getCurrentUser()
        if (user._source.dbClass) {
            const kRes = await kuzzle.document.search(
                dbName,
                dbClassVersion(user._source.dbClass),
                { query: { equals: { 'user.id': user._id } } },
                { lang: 'koncorde' }
            )
            const kItem = kRes.hits.find(i => i._source.user?.id === user._id)

            let rItem: any = { user: {} }
            if (kItem) rItem = { ...kRes.hits[0]?._source, id: kRes.hits[0]?._id }
            rItem.user = { ...user._source, id: user._id }
            window.R.user = rItem
            sendOutput(noodlNode, 'userRole', rItem.user.role?.value)

        } else sendOutput(noodlNode, 'userRole', user._source.role?.value)
    } else {
        sendOutput(noodlNode, 'userRole', 'notAuthenticated')
    }

    kuzzle.on('disconnected', (...args: any) => {
        time('Reconnect')
        log('Kuzzle disconnected:', args)
    })
    kuzzle.on('reconnected', () => {
        time('Reconnect', true)
        log('Kuzzle reconnected')
    })
    kuzzle.on('tokenExpired', () => {
        sendOutput(noodlNode, 'userRole', 'notAuthenticated')
        log('Token expired')
    })
}