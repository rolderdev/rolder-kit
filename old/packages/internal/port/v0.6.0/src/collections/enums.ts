import getEnum from '../funcs/getEnum'

export const enums = {
	sizes: getEnum(['xs', 'sm', 'md', 'lg', 'xl'], true),
	orientations: getEnum(['horizontal', 'vertical']),
}
