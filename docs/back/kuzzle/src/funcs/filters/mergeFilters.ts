import { Filters } from "src/types";

export default function (filters?: Filters, filters2?: Filters): Filters {
    if (!filters && !filters2) return
    if (filters && !filters2) return filters
    if (!filters && filters2) return filters2
    if (filters && filters2) {
        if (!filters.and && !filters2.and && !filters.or && !filters2.or) return { and: [filters, filters2] }
        if (filters.and && !filters2.and && !filters.or && !filters2.or) return { and: [...filters.and, filters2] }
        if (!filters.and && filters2.and && !filters.or && !filters2.or) return { and: [filters, ...filters2.and] }
        if (!filters.and && !filters2.and && filters.or && !filters2.or) return { or: [...filters.or, filters2] }
        if (!filters.and && !filters2.and && !filters.or && filters2.or) return { and: [filters, { or: filters2.or }] }
        if (filters.and && filters2.and && !filters.or && !filters2.or) return { and: [...filters.and, ...filters2.and] }
        if (!filters.and && !filters2.and && filters.or && filters2.or) return { or: [...filters.or, ...filters2.or] }
        if (filters.and && !filters2.and && !filters.or && filters2.or) return { and: [{ or: filters2.or }, ...filters.and] }
    }
}