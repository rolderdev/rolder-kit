import { useDataStores } from "../molecules";

export default function (props: { noodlNode: NoodlNode, scopeId: Symbol }) {
    const { scopeId, noodlNode } = props
    const [dataStores] = useDataStores()

    return Object.keys(dataStores).map(
        dbClass => {
            const scheme = dataStores[dbClass].scheme
            const enabled = dataStores[dbClass].enabled
            //  return <DataScope {...{ scopeId, noodlNode, scheme, enabled }} />
        }
    )
}