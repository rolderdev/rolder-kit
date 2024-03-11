import { MantineTheme } from '@mantine/core'
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
const kuzzle = new Kuzzle(new WebSocket(`rolder.app`, { port: 443 }))
import { QueryClient } from '@tanstack/react-query'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always",
        },
    },
})
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import weekYear from 'dayjs/plugin/weekYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(dayOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(weekday)
dayjs.extend(weekYear)
dayjs.extend(weekOfYear)
dayjs.extend(timezone)
dayjs.locale('ru')

export type DbClass = {
    version: string,
    states: {
        [naem: string]: {
            value: string,
            label: string,
            order?: number,
            color?: string
        }
    }
}

declare global {
    type Rolder = {
        states: {
            backend: 'notInitialized' | 'initializing' | 'initialized'
            online: boolean
            debug: number
            signedIn?: boolean
            devMode: boolean
        }
        env: {
            rolderKit?: string
            project?: string
            projectVersion?: string
            backendVersion?: string
            dbName?: string
        }
        params: {
            moduleFedereation?: boolean
            dbClasses?: {
                [x: string]: {
                    version: number
                }
            }
            sessionTimeout?: string
            defaults?: {
                dateFormat: string
            }
            colorScheme?: 'light' | 'dark',
        }
        dbClasses?: {
            [x: string]: DbClass
        }
        libs: {
            Kuzzle?: typeof kuzzle
            queryClient?: typeof queryClient
            mantine?: {
                MantineError(title: string, message?: string, autoClose?: boolean | number): void
            }
            dayjs?: typeof dayjs
            [name: string]: any
        }
        utils: any
        user?: any
    }
}

export type Item = {
    id: string
    content?: { [key: string]: any }
    states?: { [key: string]: any }
    [key: string]: {
        id: string
        content?: { [key: string]: any }
    }
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
}

export type User = {
    [ket: string]: any
    user: {
        username?: string,
        id?: string,
        role?: {
            value: string
            label: string
        }
    }
}