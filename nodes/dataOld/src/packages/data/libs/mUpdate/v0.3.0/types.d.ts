declare type UpdateItems = {
    dbClass: string
    items: {
        id: string
        body: ItemBody
    }[]
}

declare type KuzzleOptions = {
    refresh: boolean
    silent: boolean
}