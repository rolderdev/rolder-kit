import Query from "./Query";
import { useCurrentOrder, useInitialSchemes } from "./hooks";

export default function (props: { noodlNode: NoodlNode }) {
    const initialSchemes = useInitialSchemes()
    // as render trigger
    const currentOrder = useCurrentOrder()

    console.log('Provider render', currentOrder)

    return initialSchemes.map(initialScheme => <Query {...{
        noodlNode: props.noodlNode,
        initialSchemes,
        initialScheme
    }} />)
}