import type { BaseReactProps } from '@packages/node';
import type {} from 'types';

export type Props = BaseReactProps & {
	dropZoneTitle?: string;
	acceptedType: '*' | 'pdf' | 'excel' | 'image';
	acceptIconName: string;
	rejectIconName: string;
	idleIconName: string;
	iconSize?: string;
	stroke?: number;
};
