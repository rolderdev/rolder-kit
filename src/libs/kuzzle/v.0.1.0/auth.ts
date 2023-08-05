import Cookies from "js-cookie"
import Ms from "ms"

const auth = {
    login: (props: any) => {
        const Rolder = window.Rolder
        const Kuzzle = window.Kuzzle

        const { debug } = Rolder
        const { credentials, expiresIn } = props
        return Kuzzle.connect().then(() =>
            Kuzzle.auth.login('local', credentials, expiresIn)
                .then((jwt: string) => {
                    Cookies.set('jwt', jwt, { expires: 30 })
                    Cookies.set('jwtExpiresAt', Date.now() + Ms(expiresIn), { expires: 30 })
                    if (debug > 1) console.log('Authenticated:', credentials.username)
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