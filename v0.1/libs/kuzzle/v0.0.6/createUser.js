import ErrorHandler from '../../error-handler/v0.0.1/ErrorHandler'
import { convertOne } from './convert'

const createUser = async ({ body }) => {
    const { debug } = Rolder

    if (debug > 0) console.time('CreateUser time')
    if (debug > 1) console.log('Props:', { body })

    return Kuzzle.connect().then(() =>
        Kuzzle.security.createUser(null, body, { refresh: 'wait_for' })
            .then((response) => {
                const jsonItem = convertOne(response)
                if (debug > 1) console.log('CreateUser:', jsonItem)
                if (debug > 0) console.timeEnd('CreateUser time')
                return jsonItem
            })
            .catch((error) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle createUser ' + ': ' + error.message }))
    )
}

export default createUser