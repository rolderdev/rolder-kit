import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../errorHandler/v0.1.0/ErrorHandler'
import { convertKuzzleResponse } from '../../../../utils/data/v0.3.0/data'

const createUser = async (body: any, options?: Options) => {
    const Kuzzle = window.Kuzzle

    conLog(`CreateUser`, 'time')
    conLog([`Props: `, { body, options }])

    return Kuzzle.connect().then(() =>
        Kuzzle.security.createUser(null, body, options)
            .then((response: any) => {
                const jsonItem = convertKuzzleResponse(response)
                conLog([`CreateUser: `, jsonItem])
                conLog(`CreateUser`, 'timeEnd')
                return jsonItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle createUser ' + ': ' + error.message }))
    )
}

export default createUser