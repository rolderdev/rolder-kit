import { dbVersion } from "../../../../2_back/tools/getVersion/v0.2.0/getVersion"
import { setFilters, setOptions, setSorts } from "../../setDefaults/v0.2.0/setDefaults"

const getQueryKey: GetQueryKey = {
    all: () => [{ dbVersion: dbVersion() }],
    dbClass: (dbClass) => [{ ...getQueryKey.all()[0], dbClass }],
    command: (command, dbClass) => [{ ...getQueryKey.dbClass(dbClass)[0], command }],
    fetch: ({ dbClass, filters, sorts, options, subscribe }) => [{
        ...getQueryKey.command('fetch', dbClass)[0],
        filters: setFilters(dbClass, filters),
        sorts: setSorts(dbClass, sorts),
        options: setOptions(dbClass, options),
        subscribe
    }],
    get: ({ dbClass, itemId, subscribe }) => [{ ...getQueryKey.command('get', dbClass)[0], itemId, subscribe }],
}
export default getQueryKey