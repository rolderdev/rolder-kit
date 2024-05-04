# useNamedChildren

Хука для фильтрации дочерних компонент.

## Принимает:

- children с props любой компоненты
- список названий нод Noodl

## Возвращает:

- matchedChildren: {NodeName: component} - компоненты совпадающие по именам нод
- restChildren: component[] - остальные компоненты
