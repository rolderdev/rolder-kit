import { UseQueryOptions } from "@tanstack/react-query";

export default function (options: UseQueryOptionsProps) {
    const { command, subscribe } = options
    let queryOptions: UseQueryOptions = {}

    if (command === 'search') queryOptions.staleTime = 0
    else if (subscribe) {
        queryOptions.staleTime = Infinity
        queryOptions.cacheTime = Infinity
    }

    return queryOptions
}