import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'
import { convertKuzzleResponse } from '../../../utils/data/v0.2.0/data'

const createUser = async ({ body }: { body: any }) => {
    const Kuzzle = window.Kuzzle
    const { debug } = window.Rolder

    if (debug > 0) console.time('createUser time')
    if (debug > 1) console.log('Props:', { body })

    return Kuzzle.connect().then(() =>
        Kuzzle.security.createUser(null, body, { refresh: 'wait_for' })
            .then((response: any) => {
                const jsonItem = convertKuzzleResponse(response)
                if (debug > 1) console.log('createUser:', jsonItem)
                if (debug > 0) console.timeEnd('createUser time')
                return jsonItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle createUser ' + ': ' + error.message }))
    )
}

export default createUser