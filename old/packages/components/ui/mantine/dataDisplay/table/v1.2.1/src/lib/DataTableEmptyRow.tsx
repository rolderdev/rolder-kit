import { createStyles } from '@mantine/core'
import React from 'react'

const useStyles = createStyles({
	root: {
		'&&': {
			background: 'transparent',
			':last-of-type td': {
				borderBottom: 'none',
			},
		},
	},
})

export default function DataTableEmptyRow() {
	const { classes } = useStyles()
	return (
		<tr className={classes.root}>
			<td />
		</tr>
	)
}
