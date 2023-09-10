import { useInterval, useShallowEffect } from "@mantine/hooks";
import useData from "../../../../../libs/useData/v0.5.0/useData"
import { sendOutput } from "../../../../../utils/noodl/send/v0.2.0/send";
import { forwardRef, useState } from "react";
import mGetUsers from "../../../../../libs/kuzzle/mGetUsers/v0.1.0/mGetUsers";
import getSorts from "../../../../../libs/kuzzle/utils/getSorts/v0.1.0/getSorts";
import subscribe from "../../../../../libs/kuzzle/subscribe/v0.2.0/subscribe";
import getFilters from "../../../../../libs/kuzzle/utils/getFilters/v0.1.0/getFilters";

const Fetch = forwardRef(function (props: any) {
    const { Noodl } = window
    const { noodlNode, dbClass, getUsers, subscribe: subscribeEnabled, filters, sorts, searchString, prevSearchString } = props

    const { isLoading, isFetching, data, refetch } = useData.fetch(props)
    sendOutput(noodlNode, 'loading', isLoading)
    sendOutput(noodlNode, 'searching', isFetching && !isLoading)

    useShallowEffect(() => { if (!searchString && prevSearchString) refetch() }, [searchString])


    // subscribe    
    useShallowEffect(() => {
        if (subscribeEnabled) subscribe({ dbClass, filters: getFilters(dbClass, filters), sorts: getSorts(dbClass, sorts) })
    }, [subscribeEnabled, filters, sorts])

    //// users
    // interval to wait data loads and get refs
    const interval = useInterval(() => { }, 100);
    // get users on data changes if dbClass has user reference
    const [usersLoaded, setUsersLoaded] = useState(false)
    function getUsersHandler() {
        if (!usersLoaded && getUsers && data?.items?.length) {
            if (eval(Noodl.getProjectSettings().dbClasses)?.[0]?.[dbClass]?.references?.includes('user')) {
                const userIds = data?.items?.map(i => i.user?.id)
                if (userIds) {
                    mGetUsers(userIds)
                    interval.stop()
                    setUsersLoaded(true)
                }
            }
        }
    }
    // get users on enable immediately
    useShallowEffect(() => { if (getUsers) interval.start() }, [getUsers])
    // trigger load users
    useShallowEffect(() => { if (getUsers) getUsersHandler() }, [interval])
    return <></>
})

export default Fetch