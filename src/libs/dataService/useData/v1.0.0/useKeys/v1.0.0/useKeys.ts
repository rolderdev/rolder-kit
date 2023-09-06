import { dbVersion } from "../../../../../../utils/data/v0.2.0/data"

const useKeys = {
    all: () => [{ dbVersion: dbVersion() }],
    dbClasses: (dbClasses: string[]) => [{ ...useKeys.all()[0], dbClasses }],
    command: (command: string, dbClasses: string[]) => [{ ...useKeys.dbClasses(dbClasses)[0], command }],
    fetch: (props: { dbClasses: string[]; query: { [x: string]: any }[]; sort: any[]; options: any[] }) => [{
        ...useKeys.command('fetch', props.dbClasses)[0],
        query: props.query
            ? {
                bool: {
                    filter: Object.keys(props.query[0]).map(key => ({
                        term: { [key]: props.query[0][key] }
                    }))
                }
            }
            : {},
        sort: props.sort ? props.sort[0] : window.Rolder?.dbClasses[props.dbClasses[0]].defaultSort,
        options: props.options ? props.options[0] : window.Rolder?.dbClasses[props.dbClasses[0]].defaultOptions,
    }] as const,
    customFetch: (props: { dbClasses: string[]; query: any[]; sort: any[]; options: any[]; }) => [{
        ...useKeys.command('customFetch', props.dbClasses)[0],
        query: props.query ? props.query[0] : {},
        sort: props.sort ? props.sort[0] : window.Rolder?.dbClasses[props.dbClasses[0]].defaultSort,
        options: props.options ? props.options[0] : window.Rolder?.dbClasses[props.dbClasses[0]].defaultOptions,
    }] as const,
    get: (props: { dbClasses: string[]; itemId: string; }) => [{ ...useKeys.command('get', props.dbClasses)[0], itemId: props.itemId }] as const,
    mGet: (props: { dbClasses: string[]; itemsIds: string[]; }) => [{ ...useKeys.command('mGet', props.dbClasses)[0], itemsIds: props.itemsIds }] as const,
    search: (props: {
        dbClasses: string[]; query: {
            searchString?: string; fields: string[];
        }; options: any[];
    }) => [{
        ...useKeys.command('search', props.dbClasses)[0],
        query: {
            multi_match: {
                query: props.query.searchString,
                fuzziness: 1,
                fields: props.query.fields
            }
        },
        options: props.options ? props.options[0] : {}
    }]
}
export default useKeys