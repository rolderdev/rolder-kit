import { FC, useEffect, useContext, useRef } from 'react';
import InitializeAppService from './services/initializeAppService'
import { SqliteServiceContext, StorageServiceContext } from '../offlineApp';
import React from 'react';

interface AppInitializerProps {
    children: any
}

const AppInitializer: FC<AppInitializerProps> = ({ children }) => {
    const ref = useRef(false);
    const sqliteService = useContext(SqliteServiceContext);
    const storageService = useContext(StorageServiceContext);
    const initializeAppService = new InitializeAppService(sqliteService,
        storageService);
    useEffect(() => {
        const initApp = async (): Promise<void> => {
            try {
                const appInit = await initializeAppService.initializeApp();
                return;
            } catch (error: any) {
                const msg = error.message ? error.message : error;
                console.log('initApp error', msg)
            }
        };
        if (ref.current === false) {
            initApp();
            ref.current = true;
        }

    }, []);

    return <>{children}</>;
};

export default AppInitializer;