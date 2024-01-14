import { MantineTheme } from '@mantine/core'
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
const kuzzle = new Kuzzle(new WebSocket(`rolder.app`, { port: 443 }))

type DbClass = {
    version: number
}

declare global {
    interface Window {
        R: RolderType
        Noodl: any
    }
}

export type RolderType = {
    states: {
        debug: number
    }
    env: {
        rolderKit?: string
        project?: string
        projectVersion?: string
        backendVersion?: string
        dbName?: string
    }
    params: {
        dbClasses?: {
            [x: string]: any//DbClass
        }
        sessionTimeout?: string
        defaults?: {
            dateFormat: string
        }
        colorScheme?: 'light' | 'dark',
        mantineTheme?: MantineTheme
    }
    dbClasses?: {
        [x: string]: DbClass
    }
    libs: {
        Kuzzle?: typeof kuzzle
        mantine?: {
            MantineError(title?: string, message?: string, autoClose?: boolean | number): void
        }
    }
    user?: any
}

export type RItem = {
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

export type Vesrions = 'v0.1.0'