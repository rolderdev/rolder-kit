import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import React from "react"
import { Props } from "./types"
import { useInterval } from "@mantine/hooks"
import ms from "ms";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { getKuzzle } from '@shared/get-kuzzle'
import { sendOutput, sendSignal } from "@shared/port-send";
import { prepData } from "@shared/prep-data"
import { Preferences } from '@capacitor/preferences'

// refetch on window visible and signedIn, but dont trigger onFocus (does't work on mobile and too often)
focusManager.setEventListener(handleFocus => {
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === "visible") {
                const Kuzzle = await getKuzzle()
                if (!Kuzzle) { return false }
                if (onlineManager.isOnline()) {
                    const tokenValidation = await Kuzzle.auth.checkToken()
                    if (tokenValidation.expiresAt) handleFocus()
                    else {
                        Noodl.Events.emit('signOut')
                        log.info('React-query focus manager: token is not valid, signed out', tokenValidation)
                        return false
                    }
                }
            }
        }, false)
    }
    return () => {
        //@ts-ignore
        window.removeEventListener('visibilitychange', handleFocus)
    }
})

export default forwardRef(function (props: Props, ref) {
    R.params.sessionTimeout = props.sessionTimeout

    const online = onlineManager.isOnline()
    const [signedIn, setSignedIn] = useState<boolean | undefined>(R.states.signedIn)

    useEffect(() => {
        if (!props.username && !props.password && signedIn === undefined) {
            const parentNodeName = props.noodlNode.parent.model.type?.split('.')[1]
            if (parentNodeName !== 'Data') {
                log.error('Auth node error:', `Parent node must be Data, got ${parentNodeName}`)
                return
            }

            Preferences.get({ key: 'userSessionToken' }).then(async r => {
                const K = await getKuzzle()
                if (!K) return

                const userSessionToken = r.value
                if (userSessionToken) {
                    if (online) {
                        K.auth.checkToken(userSessionToken).then(async tokenValidation => {
                            if (tokenValidation.expiresAt) {
                                const startTime = log.start()

                                K.jwt = userSessionToken
                                await Preferences.set({ key: 'userSessionToken', value: userSessionToken })

                                tokenRefresh.start()

                                prepData().then(async user => {
                                    if (user) await Preferences.set({ key: 'user', value: JSON.stringify(user) })
                                    R.libs.queryClient?.resumePausedMutations()
                                    sendOutput(props.noodlNode, 'userRole', user?.user?.role?.value || null)
                                    sendSignal(props.noodlNode, 'signedIn')
                                    R.states.signedIn = true
                                    setSignedIn(true)

                                    log.end('Session restored', startTime)
                                })
                            } else {
                                R.libs.queryClient?.resumePausedMutations()
                                R.states.signedIn = false
                                setSignedIn(false)
                                sendOutput(props.noodlNode, 'userRole', null)
                                sendSignal(props.noodlNode, 'signedOut')
                                Preferences.remove({ key: 'userSessionToken' })
                                log.info('Session restore: token is not valid, signed out', tokenValidation)
                            }
                        })
                    } else {
                        K.jwt = userSessionToken
                        tokenRefresh.start()

                        Preferences.get({ key: 'user' }).then(userStore => {
                            Preferences.get({ key: 'dbClasses' }).then(dbClassesStore => {
                                Preferences.get({ key: 'creds' }).then(credsStore => {
                                    if (credsStore.value) window.R.params.creds = JSON.parse(credsStore.value)
                                    if (dbClassesStore.value) window.R.dbClasses = JSON.parse(dbClassesStore.value)
                                    if (userStore.value) {
                                        R.user = JSON.parse(userStore.value)
                                        sendOutput(props.noodlNode, 'userRole', JSON.parse(userStore.value)?.user?.role?.value || null)
                                    }
                                    sendSignal(props.noodlNode, 'signedIn')
                                    R.states.signedIn = true
                                    setSignedIn(true)
                                })
                            })
                        })
                    }
                } else {
                    R.states.signedIn = false
                    setSignedIn(false)
                    sendOutput(props.noodlNode, 'userRole', null)
                    sendSignal(props.noodlNode, 'signedOut')
                    log.info('Restore session: no token, signed out')
                }
            })

            getKuzzle().then(K => {
                if (K) K.on('tokenExpired', () => {
                    R.states.signedIn = false
                    setSignedIn(false)
                    sendOutput(props.noodlNode, 'userRole', null)
                    sendSignal(props.noodlNode, 'signedOut')
                    Preferences.remove({ key: 'userSessionToken' })
                    log.info('Kuzzle: token expired')
                })
            })

            Noodl.Events.on('signOut', () => {
                R.states.signedIn = false
                setSignedIn(false)
                sendOutput(props.noodlNode, 'userRole', null)
                sendSignal(props.noodlNode, 'signedOut')
                Preferences.remove({ key: 'userSessionToken' })
            })
        }
    }, [signedIn])

    const tokenRefresh = useInterval(async () => {
        const K = await getKuzzle()
        if (K && online) {
            try {
                const tokenValidation = await K.auth.refreshToken({ expiresIn: props.sessionTimeout || '5d' })
                await Preferences.set({ key: 'userSessionToken', value: tokenValidation.jwt })
                log.info('Token refreshed', tokenValidation)
            } catch (e) {
                R.states.signedIn = false
                setSignedIn(false)
                sendOutput(props.noodlNode, 'userRole', null)
                sendSignal(props.noodlNode, 'signedOut')
                Preferences.remove({ key: 'userSessionToken' })
                log.error('Token refresh error', e)
            }
        }
    }, ms('1h'))

    useImperativeHandle(ref, () => ({
        async signIn() {
            const { username, password } = props
            if (!username || !password) {
                log.error('Username or password cannot by empty')
                return
            }

            const K = await getKuzzle()
            if (!K) { return }

            if (username && password) {
                const startTime = log.start()
                try {
                    const userSessionToken = await K.auth.login('local', { username, password }, props.sessionTimeout || '5d')
                    await Preferences.set({ key: 'userSessionToken', value: userSessionToken })

                    tokenRefresh.start()
                    const user = await prepData()
                    if (user) await Preferences.set({ key: 'user', value: JSON.stringify(user) })
                    R.states.signedIn = true
                    setSignedIn(true)
                    sendOutput(props.noodlNode, 'userRole', user?.user?.role?.value || null)
                    sendSignal(props.noodlNode, 'signedIn')
                } catch (e: any) {
                    setSignedIn(false)

                    let errorMessage = 'Неизвестная ошибка'
                    switch (e.code) {
                        case 67305492: errorMessage = 'Неверный логин или пароль'; break
                        case 33685517: errorMessage = 'Слишком много неуспешных попыток'; break
                        default: log.error('Sign in failed', e); break
                    }

                    //@ts-ignore
                    sendOutput(props.noodlNode, 'error', errorMessage)
                    //@ts-ignore
                    sendSignal(props.noodlNode, 'signInFailed')
                }

                log.end('Signed in', startTime)
            }
        }
    }), [props])

    return <>{signedIn
        ? props.children
        : null
    }</>
})