import { useDebouncedValue, useShallowEffect } from "@mantine/hooks";
import { forwardRef, useState } from "react";
import getQuery from "../../../../../libs/dataService/0_query/getQuery/v0.7.0/getQuery";
import { setFilters, setSorts } from "../../../../../libs/dataService/0_query/tools/setDefaults/v0.2.0/setDefaults";
import mGetUsers from '../../../../../libs/dataService/2_back/get/mGetUsers/v0.2.0/mGetUsers'
import updateNDBClass from "../../../../../libs/dataService/1_transform/update/v0.1.0/updateNDBClass";
import subscribe from "../../../../../libs/dataService/2_back/get/subscribe/v0.3.0/subscribe";
import triggerQueries from "../../../../../libs/dataService/1_transform/tools/triggerQueries/v0.1.0/triggerQueries";
import search from '../../../../../libs/dataService/2_back/get/search/v0.4.0/search'
import { sendOutput } from "../../../../../main/ports/send/v0.3.0/send";

const Fetch = forwardRef(function (props: any) {
    const { Noodl } = window
    const {
        node, dbClass, getUsers, subscribe: subscribeEnabled, filters, sorts,
        searchString, searchDelay, send, useReferences, searchFields
    } = props

    // fetch
    const { isLoading, data } = getQuery.fetch(props)
    useShallowEffect(() => {
        if (data) {
            if (data?.version > 0) updateNDBClass(dbClass)
            send(Noodl.Objects[dbClass])
        }
    }, [data])
    sendOutput(node, 'loading', isLoading)

    // search
    const [debounced] = useDebouncedValue(searchString, searchDelay);
    useShallowEffect(() => {
        if (debounced?.length > 1) {
            sendOutput(node, 'searching', true)
            search({ dbClass, searchString: debounced, useReferences, searchFields, sorts: setSorts(dbClass, sorts) }).then((searchNResults) => {
                if (searchNResults) send(searchNResults)
                sendOutput(node, 'searching', false)
            })
        }
    }, [debounced])
    useShallowEffect(() => { if (!searchString?.length) send(Noodl.Objects[dbClass]) }, [searchString])

    // subscribe    
    useShallowEffect(() => {
        if (data && subscribeEnabled) subscribe({ dbClass, filters: setFilters(dbClass, filters), sorts: setSorts(dbClass, sorts) })
    }, [data, subscribeEnabled, filters, sorts])

    // users
    const [usersLoaded, setUsersLoaded] = useState(false)
    useShallowEffect(() => {
        if (data && getUsers && !usersLoaded) {
            if (eval(Noodl.getProjectSettings().dbClasses)?.[0]?.[dbClass]?.references?.includes('user')) {
                const userIds = data?.items?.map(i => i.user?.id)
                if (userIds) mGetUsers(userIds).then(() => triggerQueries(dbClass))
            }
            setUsersLoaded(true)
        }
    }, [data, getUsers])

    return <></>
})

export default Fetch