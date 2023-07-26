const auth = {
    login: (props) => {
        const { debug } = Rolder
        const { credentials, expiresIn } = props

        return Kuzzle.auth.login('local', credentials, expiresIn)
            .then((jwt) => {
                cookies.set('jwt', jwt, { expires: 30 })
                cookies.set('jwtExpiresAt', Date.now() + ms(expiresIn), { expires: 30 })
                if (debug > 1) console.log('Authenticated:', credentials.username)
                return { error: false }
            })
            .catch((error) => {
                if (debug > 1) console.log('Authentication failed:', error.message)
                const errorMessage = error.code === 67305492 ? 'Неверный логин или пароль' : 'Неизвестная ошибка'
                return { error: true, message: errorMessage }
            })
    },
}

export default auth