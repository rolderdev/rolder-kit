import { useShallowEffect } from "@mantine/hooks";
import { sendOutput } from "../../../../../utils/noodl/send/v0.2.0/send";
import { forwardRef, useState } from "react";
import getQuery from "../../../../../libs/dataService/0_query/getQuery/v0.7.0/getQuery";
import { setFilters, setSorts } from "../../../../../libs/dataService/0_query/tools/setDefaults/v0.2.0/setDefaults";
import mGetUsers from '../../../../../libs/dataService/2_back/get/mGetUsers/v0.2.0/mGetUsers'
import updateNDBClass from "../../../../../libs/dataService/1_transform/update/v0.1.0/updateNDBClass";
import subscribe from "../../../../../libs/dataService/2_back/get/subscribe/v0.3.0/subscribe";
import triggerQuery from "../../../../../libs/dataService/1_transform/tools/triggerQueries/v0.1.0/triggerQueries";
import search from '../../../../../libs/dataService/2_back/get/search/v0.4.0/search'

const Fetch = forwardRef(function (props: any) {
    const { Noodl } = window
    const { noodlNode, dbClass, getUsers, subscribe: subscribeEnabled, filters, sorts, searchString, prevSearchString, send } = props

    const { isLoading, isFetching, data } = getQuery.fetch(props)
    console.log('Fetch', data?.version, { data, isLoading, isFetching })
    useShallowEffect(() => {
        if (data) {
            if (data?.version > 0) updateNDBClass(dbClass)
            send(Noodl.Objects[dbClass])
        }
    }, [data])

    sendOutput(noodlNode, 'loading', isLoading)
    sendOutput(noodlNode, 'searching', isFetching && !isLoading)

    //useShallowEffect(() => { if (!searchString && prevSearchString) refetch() }, [searchString])
    // search
    if (searchString?.length > 1) search()


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
                if (userIds) mGetUsers(userIds).then(() => triggerQuery(dbClass))
            }
            setUsersLoaded(true)
        }
    }, [data, getUsers])

    return <></>
})

export default Fetch