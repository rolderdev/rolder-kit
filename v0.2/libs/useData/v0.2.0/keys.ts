import { dbVersion } from "../../../utils/data/v0.2.0/data"

const keys = {
    all: () => [{ dbVersion: dbVersion() }],
    dbClass: (dbClass: string) => [{ ...keys.all()[0], dbClass }],
    command: (command: string, dbClass: string) => [{ ...keys.dbClass(dbClass)[0], command }],
    fetch: (props: { dbClass: string; query: { [x: string]: any }[]; sort: any[]; options: any[] }) => [{
        ...keys.command('fetch', props.dbClass)[0],
        query: props.query
            ? {
                bool: {
                    filter: Object.keys(props.query[0]).map(key => ({
                        term: { [key]: props.query[0][key] }
                    }))
                }
            }
            : {},
        sort: props.sort ? props.sort[0] : window.Rolder?.dbClasses[props.dbClass].defaultSort,
        options: props.options ? props.options[0] : window.Rolder?.dbClasses[props.dbClass].defaultOptions,
    }],
    customFetch: (props: { dbClass: string; query: any[]; sort: any[]; options: any[]; }) => [{
        ...keys.command('customFetch', props.dbClass)[0],
        query: props.query ? props.query[0] : {},
        sort: props.sort ? props.sort[0] : window.Rolder?.dbClasses[props.dbClass].defaultSort,
        options: props.options ? props.options[0] : window.Rolder?.dbClasses[props.dbClass].defaultOptions,
    }],
    get: (props: { dbClass: string; itemId: string; }) => [{ ...keys.command('get', props.dbClass)[0], itemId: props.itemId }],
    mGet: (props: { dbClass: string; itemsIds: string[]; }) => [{ ...keys.command('mGet', props.dbClass)[0], itemsIds: props.itemsIds }],
    search: (props: {
        dbClasss: string; query: {
            searchString: any; fields: any;
        }[]; options: any[];
    }) => [{
        ...keys.command('search', props.dbClasss)[0],
        query: props.query[0].searchString
            ? {
                multi_match: {
                    query: props.query[0].searchString,
                    fuzziness: 1,
                    fields: props.query[0].fields
                }
            }
            : {},
        options: props.options ? props.options[0] : {}
    }]
}
export default keys