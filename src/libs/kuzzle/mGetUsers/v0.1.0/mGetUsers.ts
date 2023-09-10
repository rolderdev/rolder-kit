import { convertKuzzleResponse } from '../../../../utils/data/v0.3.0/data'
import conLog from '../../../../utils/debug/conLog/v0.1.0/conLog'
import ErrorHandler from '../../../errorHandler/v0.1.0/ErrorHandler'
import updateNoodlClass from '../../utils/updateNoodlClass/v0.1.0/updateNoodlClass'

async function mGetUsers(ids: string[]): Promise<NoodlDbClass> {
    const { Kuzzle, Noodl } = window

    conLog('mGetUser', 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.security.mGetUsers(ids)
            .then((response: any) => {
                let users = response.map((k: any) => convertKuzzleResponse(k))
                Promise.all(
                    users.map((i: any) => Kuzzle.security.getCredentials('local', i.id))
                ).then((r) => {
                    users = users.map((i: any, idx: number) => {
                        i.username = r[idx].username
                        return i
                    })
                    updateNoodlClass({ dbClass: 'user', rawItems: users })
                    conLog('mGetUser', 'timeEnd')
                    return Noodl.Objects.user
                })
            }).catch((error: { message: string }) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mGetUsers: ' + error.message }))
    )
}

export default mGetUsers