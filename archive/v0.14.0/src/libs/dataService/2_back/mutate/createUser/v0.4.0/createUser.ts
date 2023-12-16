import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import addNItem from "../../../../1_transform/create/v0.1.0/addNItem"
import { convertKUser } from "../../../../1_transform/tools/convertK/v0.1.0/convertK"
import deepFlush from "../../../../1_transform/tools/deepFlush/v0.1.0/deepFlush"
import triggerQueries from "../../../../1_transform/tools/triggerQueries/v0.1.0/triggerQueries"

const createUser = async (createUser: CreateUpdateUser): Promise<NItem> => {
    const { Kuzzle } = window
    const { body } = createUser
    const options = { refresh: 'wait_for' }
    const flushedBody = deepFlush(body)

    const content = { ...flushedBody.content, credentials: { local: { notSecret: flushedBody.credentials?.local.notSecret } } }
    let credentials = flushedBody.credentials
    delete credentials?.local.notSecret

    conLog(`CreateUser`, 'time')
    conLog([`CreateUser props: `, { content, credentials }])

    return Kuzzle.connect().then(() =>
        Kuzzle.security.createUser(null, { content, credentials }, options)
            .then((kUser: KUser) => {
                kUser._source.credentials.local.username = credentials.local.username
                const rUser = convertKUser([kUser])?.[0]
                const nItem = addNItem('user', rUser)
                triggerQueries('user')

                conLog([`CreateUser: `, nItem])
                conLog(`CreateUser`, 'timeEnd')
                return nItem
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle createUser ' + ': ' + error.message }))
    )
}

export default createUser