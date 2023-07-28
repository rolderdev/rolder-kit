import { dbVersion } from "../../../utils/data/v.0.1.0/data"

const Rolder = window.Rolder

const keys = {
    all: () => [{ dbVersion: dbVersion() }],
    dbClass: (dbClass: string) => [{ ...keys.all()[0], dbClass }],
    command: (command: string, dbClass: string) => [{ ...keys.dbClass(dbClass)[0], command }],
    fetch: (props) => [{
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
        sort: props.sort ? props.sort[0] : Rolder?.dbClasses[props.dbClass].defaultSort,
        options: props.options ? props.options[0] : Rolder?.dbClasses[props.dbClass].defaultOptions,
    }],
    customFetch: (props) => [{
        ...keys.command('customFetch', props.dbClass)[0],
        query: props.query ? props.query[0] : {},
        sort: props.sort ? props.sort[0] : Rolder?.dbClasses[props.dbClass].defaultSort,
        options: props.options ? props.options[0] : Rolder?.dbClasses[props.dbClass].defaultOptions,
    }],
    get: (props) => [{ ...keys.command('get', props.dbClass)[0], id: props.id }],
    mGet: (props) => [{ ...keys.command('mGet', props.dbClass)[0], ids: props.ids }],
    search: (props) => [{
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