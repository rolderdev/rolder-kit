import { ReactNode } from "react"

declare type BaseProps = {
    children: ReactNode
    noodlNode: NoodlNode
    version: string
    style: { [x: string]: any }
    customProps: { [x: string]: any }
    propsFunction?(props: any): { [x: string]: any }
}

declare type UserSession = {
    username: string
    jwt: string
    jwtExpiresAt: string
}