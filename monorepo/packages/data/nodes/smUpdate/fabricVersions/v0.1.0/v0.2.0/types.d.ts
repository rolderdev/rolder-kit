type MUpdateScheme = {
    dbClass: string
    references: string[]
    kuzzleOptions: KuzzleOptions
    items: {
        id: string
        body: ItemBody
    }[]
}