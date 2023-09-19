import { Kuzzle, WebSocket } from 'kuzzle-sdk'

export default function init(project: string, envVersion: string): Kuzzle {
    return new Kuzzle(
        new WebSocket(`${project}.kuzzle.${envVersion}.rolder.app`, { port: 443 })
    )
}