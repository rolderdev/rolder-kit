declare interface RUser {
    id: string
    dbClass: string
    content: {
        role: {
            value: string
            label: string
        }
    }
    credentials?: {
        local?: {
            username?: string
            password?: string
        }
    }
}

declare type KUser = {
    _id: string
    _source: any
    credentials?: {
        local?: {
            username?: string
            password?: string
            notSecret?: string
        }
    }
}

declare type UpdateUserScheme = {
    id: string
    content: { [key: string]: any }
    credentials?: {
        local: {
            username: string
            password: string
            notSecret?: string
        }
    }
}