import { dbVersion } from "../../../../utils/data/v0.3.0/data"
import getOptions from "../../../kuzzle/utils/getOptions/v0.1.0/getOptions"
import getQuery from "../../../kuzzle/utils/getFilters/v0.1.0/getFilters"
import getSorts from "../../../kuzzle/utils/getSorts/v0.1.0/getSorts"

const useKeys: UseKeys = {
    all: () => [{ dbVersion: dbVersion() }],
    dbClass: (dbClass) => [{ ...useKeys.all()[0], dbClass }],
    command: (command, dbClass) => [{ ...useKeys.dbClass(dbClass)[0], command }],
    fetch: ({ dbClass, filters, sorts, options }) => [{
        ...useKeys.command('fetch', dbClass)[0],
        filters: getQuery(dbClass, filters),
        sorts: getSorts(dbClass, sorts),
        options: getOptions(dbClass, options),
    }],
    search: ({ dbClasses, query, options }) => [{
        ...useKeys.command('search', dbClasses)[0],
        query: query.searchString
            ? {
                multi_match: {
                    query: query.searchString,
                    fuzziness: 1,
                    fields: query.fields
                }
            }
            : {},
        options
    }]
}
export default useKeys