import { RItem } from "@shared/types"
import { Props } from "./types"
import { dbClassVersion } from '@shared/get-dbclass-version'

export default async function (props: Props): Promise<RItem[] | void> {
    const { Kuzzle } = window.R.libs
    const { dbName } = window.R.env
    const { dbClass, filters, sorts, querySize } = props

    console.groupCollapsed(`fetch ${dbClass}`)
    console.time('time')

    if (Kuzzle && dbName && dbClass) {
        await Kuzzle.connect()
        return Kuzzle.document.search(
            dbName,
            dbClassVersion(dbClass),
            { query: filters, sort: sorts },
            { size: querySize, lang: 'koncorde' })
            .then(kResponse => {
                let rItems = kResponse.hits?.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]

                console.timeEnd('time')
                console.groupEnd()

                return rItems
            }).catch((error) => { window.R.libs.mantine?.MantineError('Системная ошибка!', `Fetch ${dbClass} error: ${error.message}`) })
    } else {
        window.R.libs.mantine?.MantineError('Системная ошибка!', `Fetch ${dbClass} error: 'There are empty required props'`)
        console.info('Required props: ', { Kuzzle, dbName, dbClass })
        console.timeEnd('time')
        console.groupEnd()
    }
}