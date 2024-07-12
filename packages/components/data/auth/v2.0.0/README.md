# Компонента управления сессией пользователя. Что умеет

- Авторизует пользователя.
- Поддерживает сессию, обновляя токен.
- Поддерживает сессию, не обновляя токен, но проевряя его сразу по входу в сеть.
- Хранит сессию на диске для ее восстановления при повторных запусках. Для каждого приложения, версии, среды и ссылки своя хранилка.
- Шарит сессию между вкладками или окнами одного браузера. В том числе реактивно - вошел на одной вкладке, залогинелось и в другой.

## Изменение состояния вагон-дома v0.1.0

```mermaid
flowchart TB
    subgraph Мастер[Мастер - добавление OFFLINE]

        001[1. Общие данные
        2. Комплектация
        3. Фото
        4. QR-код
        5. Ответсвенный] --> |Создание|caravan00
        subgraph caravan00["`caravan *0*`"]
            caravan00content[content: ...
            caravan-equip --> this
            images --> s3-urls
            qr-code --> qr-code
            responsible: master, master --> master
            state.flow: notRegistered]
        end
        caravan00 ==> caravan10
        007[Выгружен] --> |Изменение|caravan10
        subgraph caravan10["`caravan *1*`"]
            caravan10content[state.flow: available]
        end
    end
    subgraph Экспедитор[Экспедитор ??? - приемка или передача OFFLINE]
        002[1. Комплектация
        2. Ответсвенный
        3. Новые фото
        4. Статус] --> |Изменение + история|caravan20
        subgraph caravan20["`caravan *2*`"]
            caravan20content[caravan-equip: изменение кол-ва
            responsible: userDbClassName, userDbClassName --> userDbClass
            images --> s3-urls
            state.flow: Статус - available, movement, rented, maintenance]
        end
    end
    subgraph Менеджер[Менеджер - управление]
        004[1. Локация
        2. Ответсвенный
        3. Статус
        4. Архивный] --> |Изменение|caravan30
        subgraph caravan30["`caravan *3*`"]
            caravan30content[location --> location
            responsible: userDbClassName, userDbClassName --> userDbClass
            state.flow: Статус
            state.archived: Архивный]
        end
    end
    subgraph Bitrix[Bitrix - синхронизация???]
        005[???] --> |импорт|caravanX["`caravan *X*`"]
        006[???] --> |экспорт|caravanX["`caravan *X*М`"]
        subgraph caravanX["`caravan *X*`"]
            caravanXcontent[???]
        end
    end
    subgraph confilctResolver[Решение конфликтов]
        resolver[Оффлайн данные в приоритете]
    end
    Менеджер --> Bitrix
    Мастер --> confilctResolver
    Мастер --> Экспедитор
    Экспедитор --> confilctResolver
    confilctResolver --> Менеджер
    confilctResolver --> Bitrix
```
