import { forwardRef, useEffect, useImperativeHandle } from "react"
import React from "react"
import { type Props } from "./types"
import useSignedIn from "./src/useSignedIn";

export default forwardRef(function (props: Props, ref) {
    const { noodlNode, sessionTimeout = '5d' } = props

    const { signedIn, signIn } = useSignedIn(noodlNode, sessionTimeout)

    useEffect(() => {
        const parentNodeName = props.noodlNode.parent.model.type?.split('.')[1]
        if (parentNodeName !== 'Data' && parentNodeName !== 'LocalData') {
            log.error('Auth node error:', `Parent node must be Data or LocalData, got ${parentNodeName}`)
            R.libs.mantine?.MantineError?.('Системная ошибка!',
                `Auth node error: parent node must be Data or LocalData, got ${parentNodeName}`)
            return
        }
    }, [])

    useImperativeHandle(ref, () => ({
        signIn() {
            const { username, password } = props
            signIn(noodlNode, sessionTimeout, username, password)
        }
    }), [props])

    return <>{signedIn
        ? props.children
        : null
    }</>
})
