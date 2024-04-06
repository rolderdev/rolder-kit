import type { User } from "types"
import { forwardRef, useImperativeHandle } from "react"
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import type { Props } from "./types"
import React from "react"
import { sendOutput, sendSignal } from "@packages/port-send"

export default forwardRef(function (props: Props, ref) {
    const { username, password } = props
    const signIn = useSignIn<User>()

    useImperativeHandle(ref, () => ({
        async signIn() {
            const { Kuzzle } = R.libs
            if (!Kuzzle) log.error('No Kuzzle instance')
            else if (username && password) {
                const startTime = log.start()

                try {

                    const jwt = await Kuzzle.auth.login('local', { username, password })
                    const { prepData } = await import('@packages/prep-data')
                    const resultUser = await prepData()
                    sendOutput(props.noodlNode, 'userRole', resultUser?.user.role)
                    sendSignal(props.noodlNode, 'signedIn')

                    if (signIn({
                        auth: { token: jwt },
                        refresh: jwt,
                        userState: resultUser
                    })) {
                    } else { log.error('Signin error') }

                } catch (e: any) {
                    let errorMessage = 'Неизвестная ошибка'
                    switch (e.code) {
                        case 67305492: errorMessage = 'Неверный логин или пароль'; break
                        case 33685517: errorMessage = 'Слишком много неуспешных попыток'; break
                    }
                    R.libs.mantine?.MantineError('Ошибка авторизации', errorMessage)
                    log.info('Sign in failed', e)
                }

                log.end('Sign in', startTime)
            } else log.error('Username or password cannot be epmty', { username, password })
        },
    }), [signIn])

    return <>{props.children}</>
})