import { StyleSheet, Text } from '@react-pdf/renderer';
import { forwardRef } from 'react';
import type { Props } from './types';
import { getCompProps } from '@packages/get-comp-props';

export default forwardRef(function (props: Props) {
	const p = { ...getCompProps(props) } as Props;

	const styles = StyleSheet.create({ text: { fontFamily: 'Roboto', ...(p.style || {}) } });

	return (
		<Text wrap={p.wrap} fixed={p.fixed} style={styles.text} {...p.customProps}>
			{p.text}
		</Text>
	);
});
