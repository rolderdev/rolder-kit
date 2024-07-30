# Компонента управления сессией пользователя. Что умеет:

- Авторизует пользователя.
- Поддерживает сессию, обновляя токен.
- Поддерживает сессию, не обновляя токен, но проевряя его сразу по входу в сеть.
- Хранит сессию на диске для ее восстановления при повторных запусках. Для каждого приложения, версии, среды и ссылки своя хранилка.
- Шарит сессию между вкладками или окнами одного браузера. В том числе реактивно - вошел на одной вкладке, залогинелось и в другой.

## Нужно использовать logout v1.1.0 для выхода.

## Изменение состояния сессии

Лидер - та вкладка или окно одного браузера, в которой RxDb стал лидером. Лидерство - механизм, с помощью которого RxDb решает, какая из вкладок будет записывать данные, а осталльные только читают их.

```mermaid
flowchart TB
    %% Инициализация
    subgraph defaults
        defaultsContent[signedIn: undefined
        sessionTimeout: '5d']
    end
    defaults --> addState
    subgraph addState[rxDb: addState 'auth']
        persistantStore[Диск] --> restore
        restore[Kuzzle.jwt: rxDb.token
        R.user: rxDb.user
        R.creds: rxDb.creds
        R.dbClasses: rxDb.dbClasses]
    end
    addState --> isOnline{В сети?}
    isOnline -->|Да| waitForLeadership{Подписка на
    смену лидера}
    waitForLeadership -->|Первый запуск - лидер| leader
    waitForLeadership -->|Смена лидера| leader
    isOnline -->|Нет| isSignedInOffline{signedIn: rxDb.signedIn
    Авторизовано на диске?}
    isSignedInOffline -->|Да| signIn
    isSignedInOffline -->|Нет| signOut
    %% Лидер
    subgraph Лидер
        leader[rxDb.leader: id] --> isOnline2{В сети?}
        startRefresh[Проверка и обновление
        токена раз в час]
        stopRefresh[Остановка обновления токена]
        subgraph checkAndRefresh[Проверка и обновление токена]
            isTokenValid{Токен
            валидный?}
            isTokenValid -->|Да| storedSignedInTrue
            isTokenValid -->|Нет| storedSignedInFalse
            isTokenValid -->|Да| startRefresh
        end
        subgraph listenConnected[Подписка на rxDb.connected]
            isStoredConnected{Изменилась на}
        end
        isStoredConnected -->|false| stopRefresh
        isStoredConnected -->|true| checkAndRefresh
        isTokenValid -->|Нет| stopRefresh
        isOnline2 -->|Да| checkAndRefresh
        isOnline2 -->|Нет| listenConnected
    end
    %% Подписки
    storedSignedInTrue --> listenToken
    subgraph listenToken[Подписка на rxDb.token]
        kuzzleJwt[Kuzzle.jwt: rxDb.token]
    end
    storedSignedInTrue --> listenSignedIn
    storedSignedInFalse --> listenSignedIn
    subgraph listenSignedIn[Подписка на rxDb.signedIn]
        isStoredSignedIn{Изменилась на}
    end
    %% Общие функции
    storedSignedInTrue[rxDb.signedIn: true
    rxDb.token: token]
    storedSignedInFalse[rxDb.signedIn: false]
    isOnline2 -->|Нет| isSignedInOffline

    isStoredSignedIn -->|true| signIn
    subgraph signIn[Вход]
        signInСontent[signedIn: true
        sendOutput.signedIn: true
        sendOutput.userRole: R.user.user.role
        sendSiganl.signedIn]
    end

    isStoredSignedIn -->|false| signOut
    subgraph signOut[Выход]
        signOutСontent[signedIn: false
        sendOutput.signedIn: false
        sendOutput.userRole: null
        sendSiganl.signedOut]
    end
```
