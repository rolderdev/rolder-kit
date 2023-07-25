import { Kuzzle, WebSocket } from 'kuzzle-sdk'

const init = (props) => {    
    return new Kuzzle(
        new WebSocket(props.project + '.kuzzle.' + props.envVersion + '.rolder.app', { port: 443 })
    )
}
export default init