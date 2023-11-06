declare type BaseProps = {
    noodlNode: NoodlNode
    version: string
    style: { [x: string]: any }
}

declare type UserSession = {
    username: string
    jwt: string
    jwtExpiresAt: string
}