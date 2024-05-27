import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Loader } from "@mantine/core"
import type { Props } from "./types"
import useAuth from "./src/useAuth";
import signIn from "./src/signIn";
import { sendOutput } from "@packages/port-send";

export default forwardRef(function (props: Props, ref) {
    const { noodlNode, sessionTimeout = '5d' } = props

    const { signedIn } = useAuth(noodlNode, sessionTimeout)

    useEffect(() => {
        const parentNodeName = props.noodlNode.parent.model.type?.split('.')[1]
        if (parentNodeName !== 'Data') {
            log.error('Auth node error:', `Parent node must be Data, got ${parentNodeName}`)
            R.libs.mantine?.MantineError?.('Системная ошибка!',
                `Auth node error: parent node must be Data, got ${parentNodeName}`)
            return
        }
    }, [])

    useImperativeHandle(ref, () => ({
        async signIn() {
            const { username, password } = props
            sendOutput(noodlNode, 'signingIn', true)
            await signIn(noodlNode, sessionTimeout, username, password)
            sendOutput(noodlNode, 'signingIn', false)
        }
    }), [props])

    return <>{
        signedIn === true
            ? props.children
            : signedIn === false
                ? null
                : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                    <Loader color="dark" size='xl' />
                </div>
    }</>
})
