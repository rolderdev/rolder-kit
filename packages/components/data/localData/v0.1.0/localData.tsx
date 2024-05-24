import { forwardRef, useEffect, useState } from "react"
import React from "react"
import type { Props } from "./types"
import initDataDb from "./src/initDataDb";
import { Loader } from "@mantine/core"
import { sendOutput, sendSignal } from '@packages/port-send';

let sended = false

export default forwardRef(function (props: Props) {
    const { dbName, backendDevMode, backendHost, collectionsDefinition } = props
    const { project, environment = 'd2' } = Noodl.getProjectSettings();

    R.env.dbName = dbName

    const [backendInited, setBackendInited] = useState(false)

    R.db?.addState('replication').then((replication) => {
        const store = replication.$;

        store.subscribe((states: Record<string, boolean>) => {
            const collectionsCount = Object.keys(collectionsDefinition).length
            const initedCount = Object.values(states).filter(i => i === true).length
            // should run once
            if (collectionsCount === initedCount && !sended) {
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

        initDataDb(collectionsDefinition, { environment, backendDevMode, backendHost })
            .then(() => setBackendInited(true))
    }, [])

    return <>{
        backendInited
            ? props.children :
            <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                <Loader color="dark" size='xl' />
            </div>
    }</>
})
