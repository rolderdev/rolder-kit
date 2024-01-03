type DbClass = {
    version: number
}

export type RolderType = {
    states: {
        debug: number
    }
    env: {
        rolderKit: string
        project?: string
        projectVersion?: string
        backendVersion?: string
        dbName?: string
    }
    params: {
        dbClasses?: {
            [x: string]: any//DbClass
        }
        sessionTimeout: string
        defaults?: {
            dateFormat: string
        }
        colorScheme: 'light' | 'dark'
    }
    dbClasses?: {
        [x: string]: DbClass
    }    
    user: any
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