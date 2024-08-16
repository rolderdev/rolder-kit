import omit from 'just-omit';
import { snapshot } from 'valtio';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import { Props } from '../types';

export default (p: Props) => {
	const data: { [dbClass: string]: any } = {};
	// В data выдаем только родительские схемы.
	p.store.schemes.forEach((schemeData) => {
		const dbClass = schemeData.scheme.dbClass;

		if (!schemeData.parentId) {
			// snapshot - запретим редактирование всего кроме items.
			data[dbClass] = { ...omit(snapshot(schemeData), ['aggregations', 'items', 'parentId']), items: schemeData.items };
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
