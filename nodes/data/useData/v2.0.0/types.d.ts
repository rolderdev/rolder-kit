import type { StoreApi } from '@davstack/store';
import type { BaseJsProps } from '@packages/node-v1.0.0';
import type { Item } from 'types';
import type { Props2 } from '';

export type Props = BaseJsProps &
	Props2 & {
		store: StoreApi<BaseProps & { subscribes: { [dbClass: string]: string | undefined } | undefined }>;
	};

/* type BaseProps = {
	apiVersion: 'v0' | 'v1';
	// Весь тип схемы не нужен, т.к. она полностью передается в Kuzzle.
	fetchScheme: Scheme;
	controlled: boolean;
	subscribe: boolean;
	subscribeScheme: Scheme;
	resultSubscribeScheme: Scheme;
};

type Scheme = { dbClass: string; dbClassV: string; filters: {} | undefined }[]; */
