import Cookies from "js-cookie";
import Ms from "ms"
import Dayjs from "dayjs";

export default async function validateJwt() {
    const Rolder = window.Rolder
    const Kuzzle = window.Kuzzle
    const { debug, sessionTimeout } = Rolder

    async function checkToken(cookieJwt: string) {
        return await Kuzzle.auth.checkToken(cookieJwt).then((result: any) => {
            if (debug > 1) console.log('validateJwt result', { valid: result.valid, expiresAt: Dayjs(result.expiresAt).format('YYYY-MM-DD HH:mm') })
            if (result.valid) {
                Kuzzle.jwt = cookieJwt
                Kuzzle.auth.refreshToken({ expiresIn: sessionTimeout }).then((response: any) => {
                    Cookies.set('jwt', response.jwt, { expires: 30 })
                    Cookies.set('jwtExpiresAt', <any>Date.now() + Ms(sessionTimeout), { expires: 30 })
                })
                return true
            } else return false
        })
    }

    if (Kuzzle) {
        const cookieJwt = Cookies.get('jwt')
        const jwtExpireDiff: number = <any>Cookies.get('jwtExpiresAt') - Date.now()
        if (Kuzzle.authenticated) {
            if (cookieJwt && jwtExpireDiff > 1000) return checkToken(cookieJwt)
            else return false
        } else if (cookieJwt && jwtExpireDiff > 1000) return checkToken(cookieJwt)
        else return false
    }
}