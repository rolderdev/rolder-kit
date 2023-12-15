import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../errorHandler/v0.1.0/ErrorHandler'

const updateUser = async (id: string, body: any, options?: Options) => {
    const Kuzzle = window.Kuzzle

    conLog(`UpdateUser`, 'time')
    conLog([`Props: `, { id, body, options }])

    return Kuzzle.connect().then(() =>
        Kuzzle.security.updateCredentials('local', id, body.credentials.local)
            .then(() => Kuzzle.security.updateUser(id, body, options))
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle updateUser ' + ': ' + error.message }))
    )
}

export default updateUser