import { Suspense, lazy, useState } from 'react'
import React from 'react'
import Loader from '../containers/Loader'
import { useInterval } from '@mantine/hooks'

const Data = lazy(() => import('@packages/data'))
const defaults = { backendVersion: 'd2', dbName: 'data', detectOffline: false }

export default function (props: any) {
    const [p] = useState({ ...defaults, ...props })

    const [inited, setInited] = useState(false)
    const authInterval = useInterval(() => {
        if (window.R.states.backend === 'initialized') {
            if (window.R.libs.Kuzzle) {
                window.R.libs.Kuzzle.jwt = p.backendDevMode
                    ? 'kapikey-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJyb2xkZXIiLCJpYXQiOjE3MTE3OTYyOTF9.4cOyTvvLSSZMv3NPy9Jh8jhBBiKgGmigdUcFznANWRM'
                    : 'kapikey-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJyb2xkZXIiLCJpYXQiOjE3MTE3NzE1ODJ9.TIx6svpoEFvsMJscX3yhFHYPYKecpjcpzLM6z1hnew8'
                window.R.libs.Kuzzle.document.search('config', 'dbclass_v1').then(r => {
                    const dbClasses: { [name: string]: any } = {}
                    r.hits.map(i => { dbClasses[i._source.name] = i._source as any })
                    window.R.dbClasses = dbClasses
                    authInterval.stop()
                    setInited(true)
                })
            }
        }
    }, 500)
    React.useEffect(() => { if (!inited) authInterval.start() }, [inited])

    return <Suspense fallback={<Loader />}>
        <Data {...p}>
            {inited ? props.children : null}
        </Data>
    </Suspense>
}