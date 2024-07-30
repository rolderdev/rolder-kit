import type { TooltipProps } from '@mantine/core';
import { BaseReactProps } from '@packages/node';

export type Props = BaseReactProps & {
	label: string;
	useCustomOffset?: boolean;
	numberOffset?: number;
	customOffset?: TooltipProps['offset'];
	hoverEvent: boolean;
	focusEvent: boolean;
	touchEvent: boolean;
	floating?: boolean;
};
