import useData from "../../../../../libs/useData/v0.5.0/useData"
import { sendOutput } from "../../../../../utils/noodl/send/v0.2.0/send";

export default function (props: any) {
    const { noodlNode, dbClasses, searchFields, debounced } = props

    const { isFetching }: any = useData.search({ dbClasses, query: { searchString: debounced, fields: searchFields } })
    sendOutput(noodlNode, 'searching', isFetching)
    return <></>
}