import get from "just-safe-get"
import map from 'just-map-object'
import type { Data, FetchScheme, Props } from "../types"
import { getKuzzle } from "@packages/get-kuzzle"

function hasErrors(data: Data): boolean {
    let returnHasErrors = false
    function setError(dbClass: string, error: string) {
        R.libs.mantine?.MantineError('Системная ошибка!', `UseData Kuzzle server error at "${dbClass}": ${error}`)
        log.error(`UseData Kuzzle server error at "${dbClass}": ${error}`)
        returnHasErrors = true
    }

    map(data, (k, v) => {
        if (v.error) setError(k, v.error)
        v.items?.map(i => {
            const error = get(i, `${k}.error`)
            if (error) setError(k, error)
            if (get(i, `hierarchyData`)) hasErrors(get(i, `hierarchyData`))
        })
    })

    return returnHasErrors
}

export default async function (p: { fetchScheme: FetchScheme, props: Props }) {
    const { fetchScheme, props } = p
    const { searchEnabled, searchString } = props

    const K = await getKuzzle()
    if (!K) { return null }
    const { dbName } = R.env
    if (!dbName) {
        R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
        log.error('No dbName', R.env)
        return null
    }

    const startTime = log.start()
    log.info(`UseData props: ${fetchScheme.map(i => i.dbClass).join(', ')}`, props)

    let response = {} as { result: Data }

    if (searchEnabled && searchString) {
        response = await K.query({ controller: 'rolder', action: 'search', dbName, searchString, fetchScheme })
        log.info(`UseData founded ${fetchScheme.map(i => i.dbClass).join(', ')}`, response.result)
        log.end(`UseData search spent time for ${fetchScheme.map(i => i.dbClass).join(', ')}`, startTime)
    } else {
        response = await K.query({ controller: 'rolder', action: 'fetch', dbName, fetchScheme })
        log.info(`UseData fetched ${fetchScheme.map(i => i.dbClass).join(', ')}`, response.result)
        log.end(`UseData fetch spent time for ${fetchScheme.map(i => i.dbClass).join(', ')}`, startTime)
    }

    if (!hasErrors(response.result)) return response.result
    else return {}
}