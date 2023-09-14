import { Kuzzle, WebSocket } from 'kuzzle-sdk'

export default function init(props: { project: string, envVersion: string }): Kuzzle {
    return new Kuzzle(
        new WebSocket(`${props.project}.kuzzle.${props.envVersion}.rolder.app`, { port: 443 })//, { cookieAuth: true }
    )
}