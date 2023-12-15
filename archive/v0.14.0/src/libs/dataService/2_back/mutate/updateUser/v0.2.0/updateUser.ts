import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import { setOptions } from "../../../../0_query/tools/setDefaults/v0.2.0/setDefaults"
import deepFlush from "../../../../1_transform/tools/deepFlush/v0.1.0/deepFlush"
import updateNItems from "../../../../1_transform/update/v0.1.0/updateNItems"

const updateUser = async (updateUser: CreateUpdateUser, optimistic: boolean): Promise<NItem> => {
    const { Kuzzle } = window
    const { id, body } = updateUser
    const options = setOptions('user')
    const flushedBody = deepFlush(body)

    let nUser = {}
    if (optimistic) nUser = updateNItems('user', [{ id, ...flushedBody }])?.[0]
    let userBody = { ...body.content, credentials: { local: { notSecret: body.credentials?.local.notSecret } } }

    conLog(`UpdateUser`, 'time')
    conLog([`Props: `, { id, flushedBody, options }])

    return Kuzzle.connect().then(() =>
        Kuzzle.security.updateCredentials('local', id, body.credentials?.local)
            .then(() => Kuzzle.security.updateUser(id, userBody, options)
                .then(() => {
                    conLog(`UpdateUser`, 'timeEnd')
                    conLog([`User updated: `, nUser])

                    if (!optimistic) nUser = updateNItems('user', [{ id, ...flushedBody }])?.[0]
                    return nUser
                }))
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle updateUser ' + ': ' + error.message }))
    )
}

export default updateUser