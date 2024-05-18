import { BaseReactProps, NoodlNode } from '@packages/node'

export type Props = BaseReactProps & SignInProps & {
    sessionTimeout?: string
}

export type SignInProps = {
    noodlNode: NoodlNode
    username?: string
    password?: string
    setSignedIn: any
}