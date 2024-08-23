import type { BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {
	label: string;
	useCustomOffset: boolean;
	numberOffset?: number;
	customOffset?: TooltipProps['offset'];
	hoverEvent: boolean;
	focusEvent: boolean;
	touchEvent: boolean;
	floating: boolean;
};
