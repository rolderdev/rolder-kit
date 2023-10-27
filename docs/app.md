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
    A>On mount] --> B{Init Kuzzle?}
        B -->|Yes| B1(Init Kuzzle) -->
            D(Validate JWT) --> E{JWT valid?}
                E -->|Yes| E1("`Auth: get current user
                Fetch: dbClasses`") --> E2
                    E2(Fetch: user dbClass) --> E3
                    E3>Output: role = userRole]
                E -->|No| F>Output: role = notAuthorized]
        B -->|No| B2((End))
```