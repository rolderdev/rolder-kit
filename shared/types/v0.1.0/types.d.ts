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
            debug: number
            signedIn?: boolean
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