declare type CreateItem = {
    dbClass: string
    body: ItemBody
}

declare type KuzzleOptions = {
    refresh: boolean
    silent: boolean
}