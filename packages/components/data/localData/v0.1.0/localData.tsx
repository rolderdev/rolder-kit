import { forwardRef, useEffect, useState } from "react"
import React from "react"
import type { Props } from "./types"
import initDataDb from "./src/initDataDb";
import { Loader } from "@mantine/core"

export default forwardRef(function (props: Props) {
    const { dbName, backendDevMode, backendHost, backendPort, collectionsDefinition, multiInstance } = props
    const { project, environment = 'd2' } = Noodl.getProjectSettings();

    R.env.dbName = dbName

    const [backendInited, setBackendInited] = useState(false)
    useEffect(() => {
        if (!project || !dbName) {
            log.error('Backend init error: empty required props.', { project, environment, dbName })
            R.libs.mantine?.MantineError?.('Системная ошибка!', `Backend init error: empty required props.`)
            return
        }

        initDataDb(collectionsDefinition, { environment, backendDevMode, backendHost, backendPort, multiInstance })
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
