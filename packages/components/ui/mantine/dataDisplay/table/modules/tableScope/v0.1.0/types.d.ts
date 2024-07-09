import { BaseReactProps } from '@packages/node';
import type { IsRecordSelectable } from './src/store';

export type Props = BaseReactProps & {
	selectionDbClasses?: string[];
	isRecordSelectable: IsRecordSelectable | undefined;
};
