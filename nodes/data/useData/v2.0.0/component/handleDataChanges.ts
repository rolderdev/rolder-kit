import { snapshot } from 'valtio';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import { Props } from '../types';
import { handleSubscribe } from './handleSubscribe';
import setHierarchy from './setHierarchy';
import setRefs from './setRefs';

export default (p: Props) => {
	if (p.subscribe) handleSubscribe(p);
	setRefs(p); // Проставим связи.
	setHierarchy(p); // Построим новую иерархию.

	// Пересоздадим Roodl-объекты, чтобы они тригерились.
	//p.store.items.forEach((i) => Noodl.Object.create(i));

	const data: { [dbClass: string]: any } = {};
	// В data выдаем только родительские схемы.
	p.store.schemes.forEach((schemeData) => {
		const dbClass = schemeData.scheme.dbClass;

		if (!schemeData.parentId) {
			// snapshot - запретим редактирование всего кроме items.
			data[dbClass] = {
				...R.libs.just.omit(snapshot(schemeData), ['aggregations', 'items', 'parentId']),
				items: schemeData.items,
			};
			sendOutput(p.noodlNode, `${dbClass}Items`, schemeData.items);
			sendOutput(p.noodlNode, `${dbClass}Fetched`, schemeData.fetched);
			sendOutput(p.noodlNode, `${dbClass}Total`, schemeData.total);
			sendOutput(p.noodlNode, `${dbClass}Aggregations`, schemeData.aggregations);
		}
	});

	sendOutput(p.noodlNode, 'data', data);
	sendOutput(p.noodlNode, 'hierarchy', p.store.hierarchy);
	sendOutput(p.noodlNode, 'fetching', false);
	sendSignal(p.noodlNode, 'fetched');
};
