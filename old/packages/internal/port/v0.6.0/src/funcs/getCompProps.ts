export const getCompProps = (props: any, other?: any) => {
	const propsFunction: Object = props.propsFunction
	try {
		return (propsFunction && Object.values(propsFunction)?.[0](props, other)) || props
	} catch (error) {
		log.error('Error at Props function: ', error)
		return props
	}
}
