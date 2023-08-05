import Cookies from "js-cookie";
import Dayjs from "dayjs";

export default async function validateJwt() {
    const Rolder = window.Rolder
    const Kuzzle = window.Kuzzle
    const { debug, sessionTimeout } = Rolder

    async function checkToken(cookieJwt: string) {
        return await Kuzzle.auth.checkToken(cookieJwt).then((result: any) => {
            if (result.valid) {
                Kuzzle.jwt = cookieJwt
                Kuzzle.auth.refreshToken({ expiresIn: sessionTimeout }).then((response: any) => {
                    const expiresAt = Dayjs(response.expiresAt).format('YYYY-MM-DD HH:mm:ss')
                    Cookies.set('jwt', response.jwt, { expires: 30 })
                    Cookies.set('jwtExpiresAt', expiresAt, { expires: 30 })
                    if (debug > 1) console.log('JWT refreshed', { expiresAt })
                })
                return true
            } else {
                if (debug > 1) console.log(result)
                return false
            }
        })
    }

    if (Kuzzle) {
        const cookieJwt = Cookies.get('jwt')        
        const jwtExpireDiff: number = Dayjs(Cookies.get('jwtExpiresAt')).diff(Dayjs())
        if (Kuzzle.authenticated) {
            if (cookieJwt && jwtExpireDiff > 1000) return checkToken(cookieJwt)
            else {
                if (debug > 1) console.log('JWT expired')
                return false
            }
        } else if (cookieJwt && jwtExpireDiff > 1000) return checkToken(cookieJwt)
        else {
            if (debug > 1) console.log('Not authenticated')
            return false
        }
    }
}