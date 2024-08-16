// Проставляет все связи.

import { Item } from '@shared/types-v0.1.0';
import { Props } from '../types';

export default (p: Props) => {
	p.store.items.forEach((item) => {
		for (const dbClassOrNot in item) {
			// Установим прямые связи. Делаем это автоматически для всего, что совпадает. Для нас это дешего за счет прокси.
			p.store.schemes.forEach((schemeData) => {
				const dbClass = schemeData.scheme.dbClass;
				// Запретим связи на самих себя. Это задача иерархии.
				if (dbClassOrNot === dbClass && dbClassOrNot !== item.dbClass) {
					if (Array.isArray(item[dbClass])) {
						let refArray: Item[] = [];
						p.store.items.forEach((i) => {
							if (item[dbClass].map((i) => i.id).includes(i.id)) refArray.push(i);
						});
						item[dbClass] = refArray;
					} else {
						const refItem = p.store.items.get(item[dbClass].id);
						if (refItem) item[dbClass] = refItem;
					}
				}
			});
		}
	});

	// Кажется, не имеет смысла раз есть иерархия.
	// Установим обратные связи.
	/* p.store.schemes.forEach((schemeData) => {
		const sourceDbClass = schemeData.scheme.dbClass;
		const backDbClasses = schemeData.scheme.backRefs;
		if (backDbClasses) {
			for (const backDbClass of backDbClasses) {				
				p.store.items.forEach((sourceItem) => {
					if (sourceItem.dbClass === backDbClass && sourceItem[sourceDbClass]) {
						// Т.к. прямые связи уже есть, просто добавим их.
						if (
							Array.isArray(sourceItem[sourceDbClass]) &&
							// Не будем проставлять обратные связи для других схем. Пусть разработчик управляет обратными связями.
							sourceItem[sourceDbClass].some((i) => schemeData.itemIds.includes(i.id))
						) {
							for (const targetItem of sourceItem[sourceDbClass]) {
								if (targetItem[backDbClasses]) targetItem[backDbClasses].push(sourceItem);
								else targetItem[backDbClasses] = [sourceItem];
							}
						} else if (schemeData.itemIds.includes(sourceItem[sourceDbClass].id)) {
							// Не смотри сюда, а то бесконечность посмотрит в ответ.
							if (sourceItem[sourceDbClass][backDbClasses]) sourceItem[sourceDbClass][backDbClasses].push(sourceItem);
							else sourceItem[sourceDbClass][backDbClasses] = [sourceItem];
						}
					}
				});
			}
		}
	}); */
};
