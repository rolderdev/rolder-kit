import { forwardRef } from 'react';
import { QueryClientProvider, useMutation } from '@tanstack/react-query';
import type { Props } from '../node/definition';
import type { BaseReactProps } from '@shared/node-v1.0.0';

function Mutation(props: any) {
	const mutation = useMutation([]);

	R.libs.mutate = mutation.mutateAsync;

	return <>{props.children}</>;
}

export default forwardRef(function (p: Props & BaseReactProps) {
	return (
		<QueryClientProvider client={R.libs.queryClient}>
			<Mutation>{p.children}</Mutation>
		</QueryClientProvider>
	);
});
