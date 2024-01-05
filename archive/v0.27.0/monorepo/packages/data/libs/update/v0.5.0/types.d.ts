declare type UpdateItem = {
    dbClass: string
    id: string
    body: ItemBody
}

declare type KuzzleOptions = {
    refresh: boolean
    silent: boolean
}