import { forwardRef, useEffect, useState } from "react"
import React from "react"
import { Props } from "./types"
import { Capacitor } from '@capacitor/core'
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader'
import { Workbox } from 'workbox-window'

pwaElements(window)
if (!customElements.get('jeep-sqlite')) customElements.define('jeep-sqlite', JeepSqlite)
export const platform = Capacitor.getPlatform()

import SqliteService from './src/services/sqliteService'
import DbVersionService from './src/services/dbVersionService'
import StorageService from './src/services/storageService'
import AppInitializer from "./src/AppInitializer"
import { User } from "./src/models/User"

export const SqliteServiceContext = React.createContext(SqliteService);
export const DbVersionServiceContext = React.createContext(DbVersionService);
export const StorageServiceContext = React.createContext(new StorageService(SqliteService, DbVersionService));
export type { User }

if (platform === "web") {
    const jeepEl = document.createElement("jeep-sqlite");
    document.body.appendChild(jeepEl);
    customElements.whenDefined('jeep-sqlite').catch((err) => {
        console.log(`Error: ${err}`);
        throw new Error(`Error: ${err}`)
    });
}

export default forwardRef(function (props: Props) {
    const [inited, setInited] = useState(false)

    useEffect(() => {
        if (props.serviceWorker && 'serviceWorker' in navigator) {
            const wb = new Workbox('/sw.js')

            wb.addEventListener('activated', event => { if (!event.isUpdate) window.location.reload() })

            wb.register()
            wb.active.then(sw => { if (sw.state === 'activated') setInited(true) })
        } else setInited(true)
    }, [])

    return <SqliteServiceContext.Provider value={SqliteService}>
        <DbVersionServiceContext.Provider value={DbVersionService}>
            <StorageServiceContext.Provider value={new StorageService(SqliteService, DbVersionService)}>
                <AppInitializer>
                    {inited ? props.children : null}
                </AppInitializer>
            </StorageServiceContext.Provider>
        </DbVersionServiceContext.Provider>
    </SqliteServiceContext.Provider>
})