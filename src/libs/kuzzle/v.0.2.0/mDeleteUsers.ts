import ErrorHandler from '../../errorHandler/v0.1.0/ErrorHandler'

const mDeleteUsers = async (deleteUserIds: string[]) => {
    const Kuzzle = window.Kuzzle
    const { debug } = window.Rolder

    if (debug > 0) console.time('mDeleteUsers time')
    if (debug > 1) console.log(' props:', { deleteUserIds })

    return Kuzzle.connect().then(() =>
        Kuzzle.security.mDeleteUsers(deleteUserIds, { refresh: 'wait_for' })
            .then((response: any) => {

                if (debug > 1) console.log('mDeleteUsers:', response)
                if (debug > 0) console.timeEnd('mDeleteUsers time')
                return
            })
            .catch((error: any) => ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle mDeleteUsers: ' + error.message }))
    )
}

export default mDeleteUsers