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

export default async function (): Promise<Item[] | void> {
    const K = await getKuzzle()
    if (!K) return

    return await K.document.search('config', 'creds_v1', undefined, { size: 100 })
        .then(kResponse => kResponse.hits?.map(kItem => ({ id: kItem._id, ...kItem._source })) as Item[])
        .catch((error) => {
            R.libs.mantine?.MantineError('Системная ошибка!', `Fetch config error"`, error)
            log.error(`Fetch config error"`, error)
        })
}