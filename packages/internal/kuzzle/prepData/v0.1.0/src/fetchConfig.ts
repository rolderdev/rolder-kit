import { getKuzzle } from '@packages/get-kuzzle'
import type { Item } from 'types'

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