import { Center, type DefaultMantineColor, Loader, type MantineNumberSize, type MantineTheme, createStyles } from '@mantine/core'
import convertColor from '@packages/convert-color'
import type { ReactNode } from 'react'
import React from 'react'

const useStyles = createStyles((theme, { bgColor, opacity }: { bgColor?: DefaultMantineColor; opacity?: number }) => ({
	//Rolder
	root: {
		zIndex: 3,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		pointerEvents: 'none',
		background: theme.fn.rgba(convertColor(bgColor) || theme.colors.dark[0], opacity || 0.75), //Rolder
		opacity: 0,
		transition: 'opacity .15s ease',
	},
	fetching: {
		pointerEvents: 'all',
		opacity: 1,
	},
}))

type DataTableLoaderProps = {
	pt: number
	pb: number
	fetching: boolean | undefined
	customContent: ReactNode | undefined
	backgroundBlur: number | undefined
	size: MantineNumberSize | undefined
	variant: MantineTheme['loader'] | undefined
	color: DefaultMantineColor | undefined
	bgColor: DefaultMantineColor | undefined //Rolder
	opacity: number | undefined //Rolder
}

export default function DataTableLoader({
	pt,
	pb,
	fetching,
	customContent,
	backgroundBlur,
	size,
	variant,
	color,
	bgColor, //Rolder
	opacity, //Rolder
}: DataTableLoaderProps) {
	const { classes, cx } = useStyles({ bgColor, opacity }) // Rolder
	return (
		<Center
			pt={pt}
			pb={pb}
			className={cx(classes.root, { [classes.fetching]: fetching })}
			sx={backgroundBlur ? { backdropFilter: `blur(${backgroundBlur}px)` } : undefined}
		>
			{fetching && (customContent || <Loader size={size} variant={variant} color={color} />)}
		</Center>
	)
}
