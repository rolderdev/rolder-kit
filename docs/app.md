# App
## Назначение
*  Контекст. Задает параметры для всех дочерних нод:
   *  Mantine - тема, настройки дат, сообщения и другое
   *  Query - параметры запросов.
   *  Rolder - параметры проекта, дефолты, классы БД.
*  Поддержка сессии пользователя.
## Процессы
```mermaid
flowchart TD
    A>On mount] --> A1{Init Kuzzle?}
        A1 -->|Yes| AY1(Init Kuzzle) --> AY2(Validate JWT)
            --> AY3{JWT valid?}
                AY3 -->|Yes| AY3Y1(Auth: get current user) & AY3Y2(Fetch: dbClasses) --> AY3Y3
                    AY3Y3(Fetch: user dbClass) --> EY4>Output: role = userRole]
                AY3 ---->|No| AY3N1>Output: role = notAuthorized]
        A1 -->|No| AN1((End))
    B>On window visible] ----> AY2
    
```