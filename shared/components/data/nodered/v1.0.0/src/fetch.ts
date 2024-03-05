import { getKuzzle } from '@shared/get-kuzzle'
import { Item } from '@shared/types'

type FetchScheme = {
    dbName: string
    dbClass: string
    query?: { [key: string]: any }
    sort?: { [key: string]: 'asc' | 'desc' }[]
    options?: {
        size?: number
        refresh?: 'wait_for'
        lang?: 'koncorde'
        silent?: boolean
    }
}

export default async function (fetchScheme: FetchScheme): Promise<Item[] | void> {
    const { dbName, dbClass, query, sort, options } = fetchScheme

    const K = getKuzzle()
    if (!K) return

    await K.connect()
    if (dbName) return K.document.search(dbName, dbClass, { query, sort }, { ...options, lang: 'koncorde' })
        .then(kResponse => kResponse.hits?.map(kItem => ({ id: kItem._id, ...kItem._source })) as Item[])
        .catch((error) => {
            R.libs.mantine?.MantineError('Системная ошибка!', `Fetch config error"`, error)
            log.error(`Fetch config error"`, error)
        })
}