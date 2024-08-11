/* Модель создает реактивность для item.
Мы не можем определить модель, т.к. не знаем структуры прилетающего item.
Но у нас есть accessor, по которому мы можем добавить реактивное поле. */

import { flow, t, type Instance } from 'mobx-state-tree';
import { Observer, observer } from 'mobx-react-lite';
import { get, set } from 'mobx';
import { nanoid } from 'nanoid';
import getValue from '@packages/get-value';
import type { Item } from 'types';
import type { NoodlNode } from '@packages/node';
import type { Column } from './columnModel';
import type { TableProps } from './tablePropsModel';
import setTemplateCells from '../funcs/setTemplateCells';
import ExpanderCell from '../components/ExpanderCell';
import { ExpansionRow } from './expansionRowModel';

// Оборачиваем ячейку типа accessor для точечной реаткивности.
// Реактивна на ключ в подготовленном объекте "accessors".
const AccessorCell = observer((p: { accessors: Record['accessors']; accessor: string }) => {
	log.debug('AccessorCell render');
	return get(p.accessors, p.accessor);
});

// Работает как accessor ячейка, но зависимости массив, а результат - выполненная функция, которую задал сам разработчик.
// getValue работает по принципу реактивной функции. Т.е. функция getValue срабатывает тогда, когда изменились зависимости.
// Разработчик должен самостоятельно указать зависимости в схеме - accessors.
// В отличии от предыдущих реализаций, getValue параметром передает не весь item, а только данные, которые были указаны в зависимостях.
// p.record.getValue - view в модели record.
const GetValueCell = observer((p: { record: Record; column: any }) => {
	log.debug('GetValueCell render');
	return p.record.getValue(p.column);
});

// У этой ячейки нет повторных рендеров. Здесь observer останавливает рендеринг, т.к. ему нечего отслеживать.
// Реактивность отдана в Noodl через Object, где указание ключей и есть точечная реактивность.
// Для этого в store.setState при изменении items объекты Noodl, используемые в reactNode пересоздаются.
const TemplateCell = observer((p: { reactNode: React.ReactNode }) => {
	log.debug('TemplateCell render');
	return p.reactNode || '';
});

interface Record extends Instance<typeof recordModel> {}
// record, а не item, т.к. здесь мы item превращаем в реактивную сущность.
// accessors - объект с реактивными ключами. Рендер на изменение конкретного ключа в соотвествующей ячейке.
// item - оригинальный item. На него можно подписываться, но нельзя на его поля.
const recordModel = t
	.model('Record', {
		id: t.identifier,
		// Состояние готовности
		state: t.model({
			ready: false,
			templateCells: false,
			expansionRow: false
		}),
		item: t.frozen<Item>(),
		accessors: t.model(),
		templateCells: t.map(t.frozen<React.ReactNode>()),
		expanded: false,
		expansionReactNode: t.frozen<React.ReactNode>()
	})
	.views((self) => ({
		ready() {},
		// Реактивная функция для отрисовки ячейки.
		render(column: Column, onRowClick: TableProps['onRowClick']) {
			let cell: React.ReactNode;
			// Ячейка с шевроном. Observer добавляет реактивность.
			const eCell = <Observer>{() => <ExpanderCell cell={cell} onRowClick={onRowClick} record={self as Record} />}</Observer>;
			console.log();
			// Для каждого типа ячейки своя компонента.
			switch (column.type) {
				case 'accessor':
					cell = <AccessorCell accessors={self.accessors} accessor={column.accessor} />;
					break;
				case 'getValue':
					cell = <GetValueCell record={self as Record} column={column} />;
					break;
				case 'template':
					cell = <TemplateCell reactNode={self.templateCells.get(column.columnIdx)} />;
					break;
				default:
					return '';
			}

			return column.expander ? eCell : cell;
		},
		// Превращает getValue разработчика в реактивную функцию.
		getValue(column: Column) {
			// self.accessors - именно это заставляет выполняться getValue только в ячейках, где есть изменения.
			// Разработчик должен обратиться к конкретному ключу в accessors, чтобы заработала реактивность.
			return column.getValue(self.accessors);
		}
	}))
	.actions((self) => {
		// Функция для добавления реактивности
		/* 		addAccessors(item: Item, columns: Column[]) {
			// Добавляем реактивные ключи для колонок "accessor" и "getValue".
			columns.map((i) => {
				if (['accessor', 'getValue'].includes(i.type)) {
					// set из MobX создает ключи-пути, получается такой объект {some.nested.key: 'value'}
					if (i.accessor) set(self.accessors, i.accessor, getValue(item, i.accessor));
					if (i.accessors) i.accessors.map((accessor) => set(self.accessors, accessor, getValue(item, accessor)));
				}
			});
		}, */
		// Функция обновляет реактивные значения из Noodl. В store.setState передается в item для использования в Noodl.
		// Подходит для сценария, когда нужно изменить ячейки из ячейки той же строки.
		function updateRecordFromNoodl(accessors: { [path: string]: any }) {
			set(self.accessors, accessors);
		}
		/* 		setTemplateCells: flow(function* (noodlNode: NoodlNode, columns: Column[]) {
			const recordTemplateCells = yield setTemplateCells(noodlNode, columns, self.id);
			for (let [columnIdx, reactNode] of recordTemplateCells) {
				self.templateCells.set(columnIdx, reactNode);
			}
		}), */
		function setExpanded(expanded: boolean) {
			self.expanded = expanded;
		}
		/* 		setExpansionReactNode: flow(function* (noodlNode: NoodlNode, expansionTemplate: string, itemId: string) {
			// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
			const group = noodlNode.nodeScope.createPrimitiveNode('Group');
			// Используем шаблон и присваиваем новый id
			const newNode = yield noodlNode.nodeScope.createNode(expansionTemplate, nanoid(), {
				// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
				_forEachModel: Noodl.Objects[itemId], // Как это работает, если мы создаем Noodl-объекты позже в установке колонок?
				// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
				_forEachNode: noodlNode
			});
			// Добавляем в группу Noodl созданную ноду
			group.addChild(newNode);
			// Здесь мы именно запускаем render, который возвращает React-ноду
			self.expansionReactNode = group.render();
		}), */
		/* const setState = flow(function* (noodlNode: NoodlNode, item: Item, columns: Column[], expansionTemplate: string) {
			Noodl.Object.create({ ...item, updateRecord });

			columns.map((i) => {
				if (['accessor', 'getValue'].includes(i.type)) {
					// set из MobX создает ключи-пути, получается такой объект {some.nested.key: 'value'}
					if (i.accessor) set(self.accessors, i.accessor, getValue(item, i.accessor));
					if (i.accessors) i.accessors.map((accessor) => set(self.accessors, accessor, getValue(item, accessor)));
				}
			});

			const recordTemplateCells = yield setTemplateCells(noodlNode, columns, self.id);
			for (let [columnIdx, reactNode] of recordTemplateCells) {
				self.templateCells.set(columnIdx, reactNode);
			}

			if (expansionTemplate) {
				// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
				const group = noodlNode.nodeScope.createPrimitiveNode('Group');
				// Используем шаблон и присваиваем новый id
				const newNode = yield noodlNode.nodeScope.createNode(expansionTemplate, nanoid(), {
					// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
					_forEachModel: Noodl.Objects[item.id],
					// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
					_forEachNode: noodlNode
				});
				// Добавляем в группу Noodl созданную ноду
				group.addChild(newNode);
				// Здесь мы именно запускаем render, который возвращает React-ноду
				self.expansionReactNode = group.render();
			}
		}); */

		const addRecord = flow(function* (noodlNode: NoodlNode, item: Item, columns: Column[], expansionTemplate: string) {
			Noodl.Object.create({ ...item, updateRecord: updateRecordFromNoodl });

			// Добавление реактивных ключей
			columns.map((i) => {
				if (['accessor', 'getValue'].includes(i.type)) {
					// set из MobX создает ключи-пути, получается такой объект {some.nested.key: 'value'}
					if (i.accessor) set(self.accessors, i.accessor, getValue(item, i.accessor));
					if (i.accessors) i.accessors.map((accessor) => set(self.accessors, accessor, getValue(item, accessor)));
				}
			});

			// Создание кастомных ячеек
			if (columns.some((i) => i.type === 'template' && i.template)) {
				const recordTemplateCells = yield setTemplateCells(noodlNode, columns, self.id);
				for (let [columnIdx, reactNode] of recordTemplateCells) {
					self.templateCells.set(columnIdx, reactNode);
				}
			}

			// Создание строк для разворачивания
			if (expansionTemplate) {
				// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
				const group = noodlNode.nodeScope.createPrimitiveNode('Group');
				// Используем шаблон и присваиваем новый id
				const newNode = yield noodlNode.nodeScope.createNode(expansionTemplate, nanoid(), {
					// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
					_forEachModel: Noodl.Objects[item.id],
					// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
					_forEachNode: noodlNode
				});
				// Добавляем в группу Noodl созданную ноду
				group.addChild(newNode);
				// Здесь мы именно запускаем render, который возвращает React-ноду
				self.expansionReactNode = group.render();
			}
		});

		return { addRecord, setExpanded };
	});

export { recordModel, type Record };
