import { ColorScheme } from '@mantine/core';
import { BaseReactProps } from '@packages/node';

export type Props = BaseReactProps & {
	multiInstance?: boolean;
	sentry?: boolean;
	sentryDsn?: string;
	remoteLogs?: boolean;
};
