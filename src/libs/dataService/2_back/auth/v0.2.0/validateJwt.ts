import Cookies from "js-cookie";
import conLog from "../../../../../utils/debug/conLog/v0.1.0/conLog";
import dayjs from "dayjs";

export default async function validateJwt() {
    const { Kuzzle, Rolder } = window
    const { sessionTimeout } = Rolder

    async function checkToken(userSession?: UserSession) {
        return await Kuzzle.auth.checkToken(userSession?.jwt).then((r: any) => {
            if (r.valid) {
                Kuzzle.jwt = userSession?.jwt
                Kuzzle.auth.refreshToken({ expiresIn: sessionTimeout }).then((r: any) => {
                    const expiresAt = dayjs(r.expiresAt).format('YYYY-MM-DD HH:mm:ss')
                    const newUserSession = { ...userSession, jwt: r.jwt }
                    Cookies.set('userSession', JSON.stringify(newUserSession), { expires: 30 })
                    Kuzzle.jwt = r.jwt
                    conLog([`JWT refreshed:`, expiresAt])
                })
                return true
            } else return false
        })
    }

    if (Kuzzle) {
        const cookie = Cookies.get('userSession')
        const userSession: UserSession | undefined = cookie && JSON.parse(cookie)
        const jwtExpireDiff: number = dayjs(userSession?.jwtExpiresAt).diff(dayjs())
        if (Kuzzle.authenticated) {
            if (userSession?.jwt && jwtExpireDiff > 10000) return checkToken(userSession)
        } else if (userSession?.jwt && jwtExpireDiff > 10000) return checkToken(userSession)
        else return false
    }
}