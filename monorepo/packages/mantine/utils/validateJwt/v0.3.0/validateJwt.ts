import { atom } from "nanostores"
import { log } from "../../../../../utils/debug/log/v0.2.0/log"

export const jwtValidState = atom(false)

export default async function validateJwt() {
    const { Kuzzle, dayjs, cookies } = window.R.libs
    const { sessionTimeout } = window.R.params

    async function checkToken(userSession?: UserSession) {
        await Kuzzle.connect()
        return await Kuzzle.auth.checkToken(userSession?.jwt).then(r => {            
            if (r.valid) {
                jwtValidState.set(true)
                Kuzzle.jwt = userSession?.jwt
                Kuzzle.auth.refreshToken({ expiresIn: sessionTimeout }).then((r: any) => {
                    const expiresAt = dayjs(r.expiresAt).format('YYYY-MM-DD HH:mm:ss')
                    const newUserSession = { ...userSession, jwt: r.jwt }
                    cookies.set('userSession', JSON.stringify(newUserSession), { expires: 30 })
                    Kuzzle.jwt = r.jwt
                    log('JWT refreshed', expiresAt)
                })
                return true
            } else {
                jwtValidState.set(false)
                return false
            }
        })
    }

    if (Kuzzle) {
        const cookie = cookies.get('userSession')
        const userSession: UserSession | undefined = cookie && JSON.parse(cookie)
        const jwtExpireDiff: number = dayjs(userSession?.jwtExpiresAt).diff(dayjs())
        if (Kuzzle.authenticated) {
            if (userSession?.jwt && jwtExpireDiff > 10000) return await checkToken(userSession)
        } else if (userSession?.jwt && jwtExpireDiff > 10000) return await checkToken(userSession)
        else return false
    }
}