type CreateScheme = {
    dbClass: string
    order: number
    references: string[]
    body: Item
    kuzzleOptions: KuzzleOptions
}