import type { Props } from '../types';
import { schemeChanged } from './schemeChanged';

export const handleChanges = (p: Props) => {
	const { apiVersion, fetchScheme, controlled, subscribe, subscribeScheme, resultSubscribeScheme } = p.store.get();

	const changeState = {
		apiVersion: apiVersion !== p.apiVersion,
		fetchScheme: schemeChanged(fetchScheme, p.fetchScheme),
		controlled: controlled !== p.controlled,
		subscribe: subscribe !== p.subscribe,
		subscribeScheme: schemeChanged(subscribeScheme, p.subscribeScheme),
		resultSubscribeScheme: schemeChanged(resultSubscribeScheme, p.subscribeScheme || p.fetchScheme),
	};

	p.store.set((s) => {
		if (changeState.apiVersion) s.apiVersion = p.apiVersion;
		if (changeState.fetchScheme) s.fetchScheme = p.fetchScheme;
		if (changeState.controlled) s.controlled = p.controlled;
		if (changeState.subscribe) s.subscribe = p.subscribe;
		if (changeState.subscribeScheme) s.subscribeScheme = p.subscribeScheme;
		if (changeState.resultSubscribeScheme) s.resultSubscribeScheme = p.subscribeScheme || p.fetchScheme;
	});

	return changeState;
};
