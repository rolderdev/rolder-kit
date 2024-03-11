import { forwardRef, useEffect, useState } from "react"
import React from "react"
import { Props } from "./types"
import { Workbox } from 'workbox-window'

export default forwardRef(function (props: Props) {
    const [inited, setInited] = useState(false)

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const wb = new Workbox('/sw.js')

            wb.addEventListener('activated', event => { if (!event.isUpdate) window.location.reload() })

            wb.register()
            wb.active.then(sw => { if (sw.state === 'activated') setInited(true) })
        } else setInited(true)
    }, [])

    return <>{inited ? props.children : null}</>
})