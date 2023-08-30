import Cookies from "js-cookie"
import Ms from "ms"
import Dayjs from "dayjs"

const auth = {
    login: (props: any) => {
        const Rolder = window.Rolder
        const Kuzzle = window.Kuzzle

        const { debug, sessionTimeout } = Rolder
        const { credentials } = props
        return Kuzzle.connect().then(() =>
            Kuzzle.auth.login('local', credentials, sessionTimeout)
                .then((jwt: string) => {
                    const expiresAt = Dayjs().add(Ms(sessionTimeout), 'ms').format('YYYY-MM-DD HH:mm:ss')
                    Cookies.set('jwtExpiresAt', expiresAt, { expires: 30 })
                    new Promise(resolve => setTimeout(resolve, 1000)).then(() => Cookies.set('jwt', jwt, { expires: 30 }))
                    if (debug > 1) console.log('Authenticated:', {
                        username: credentials.username,
                        jwtExpiresAt: expiresAt
                    })
                    return { error: false }
                })
                .catch((error: any) => {
                    if (debug > 1) console.log('Authentication failed:', error.message)
                    const errorMessage = error.code === 67305492 ? 'Неверный логин или пароль' : 'Неизвестная ошибка'
                    return { error: true, message: errorMessage }
                })
        )
    },
}

export default auth