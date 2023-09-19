import dayjs from "dayjs"
import ms from "ms"
import Cookies from "js-cookie"
import { KuzzleError } from "kuzzle-sdk/src/KuzzleError"

export default function (localCreds: LocalCreds) {
    const { Kuzzle, Rolder } = window
    const { sessionTimeout } = Rolder

    return Kuzzle.connect().then(() =>
        Kuzzle.auth.login('local', localCreds, sessionTimeout)
            .then((jwt: string) => {
                const expiresAt = dayjs().add(ms(sessionTimeout), 'ms').format('YYYY-MM-DD HH:mm:ss')
                const userSession = { username: localCreds.username, jwt, jwtExpiresAt: expiresAt }
                new Promise(resolve => setTimeout(resolve, 1000))
                    .then(() => Cookies.set('userSession', JSON.stringify(userSession), { expires: 30 }))
                return { error: false }
            }).catch((error: KuzzleError) => {
                const errorMessage = error.code === 67305492 ? 'Неверный логин или пароль' : 'Неизвестная ошибка'
                return { error: true, message: errorMessage }
            })
    )
}