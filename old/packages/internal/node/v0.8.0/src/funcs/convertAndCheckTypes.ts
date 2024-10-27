import type { NodePort, TypeName } from '@packages/port'
import typeOf from 'just-typeof'
import type { GraphModelNode, NodeContext, Props } from '../../types'
import { clearWarning, sendWarning } from './warnings'

export function convertAndCheckProp(node: GraphModelNode, context: NodeContext, nodeInput: NodePort, prop: Props) {
	const dn = nodeInput.displayName
	const typeOfValue: any = typeOf(prop)

	if (typeOfValue !== 'undefined') {
		try {
			const convertResult = convertAndCheckType(nodeInput, typeOfValue, prop)
			if (convertResult?.error) sendWarning(node, context, dn, convertResult.error)
			else {
				clearWarning(node, context, dn)
				return convertResult?.value
			}
		} catch (error: any) {
			sendWarning(node, context, dn, `Input "${dn}" has error "${error.message}"`)
		}
	} else {
		clearWarning(node, context, dn)
		return prop
	}
}

type InputType = TypeName | 'enum'
type ValueType = 'string' | 'boolean' | 'array' | 'number' | 'object'

//@ts-ignore
function convertAndCheckType(
	nodeInput: NodePort,
	typeOfValue: ValueType,
	value: any
): { value?: any; error?: string } | undefined {
	const dn = nodeInput.displayName
	const inputType = (typeof nodeInput.type === 'object' ? nodeInput.type.name : nodeInput.type) as InputType

	switch (inputType) {
		case 'array': {
			// array with one object
			if (nodeInput.customs?.isObject) {
				// first time it is string
				if (typeOfValue === 'string') {
					try {
						const evalValue = eval(value)
						// string >> object from array
						const typeOfEvalValue: any = typeOf(evalValue)
						if (typeOfEvalValue === 'array') {
							if (evalValue?.length) {
								// should have only one object
								if (evalValue?.length > 1)
									return {
										error: `Input "${dn}" should have one object or function, got ${evalValue?.length}`,
									}
								// should be an object
								if (evalValue?.length === 1 && !['object', 'function'].includes(typeof evalValue[0])) {
									return {
										error: `Input "${dn}" should be array with object or function type, got "${typeOf(evalValue[0])}"`,
									}
								}
								return { value: evalValue[0] }
							} else return { value: evalValue[0] }
						} else
							return {
								error: `Input "${dn}" should be array with one object or function, got "${typeOf(evalValue[0])}"`,
							}
					} catch (error) {
						return { error: `Input "${dn}" eval error: "${value}"` }
					}
				} else {
					if (value?.length) {
						// should have only one object
						if (value?.length > 1)
							return {
								error: `Input "${dn}" should have one object or function, got ${value?.length}`,
							}
						// should be an object
						if (value?.length === 1 && !['object', 'function'].includes(typeof value[0])) {
							return {
								error: `Input "${dn}" should be array with object type or function, got "${typeOf(value[0])}"`,
							}
						}
						return { value: value[0] }
					} else return { value: value[0] }
				}
			} else {
				//// regular array
				// first time it is string
				if (typeOfValue === 'string') {
					try {
						const evalValue = eval(value)
						const typeOfEvalValue: any = typeOf(evalValue)
						if (typeOfEvalValue === 'array') return { value: evalValue }
						else
							return {
								error: `Input "${dn}" should be array type, got "${typeOf(evalValue)}"`,
							}
					} catch (error) {
						return { error: `Input "${dn}" eval error: "${value}"` }
					}
				}
			}
			// regular array
			if (typeOfValue === 'array') return { value }
			return {
				error: `Unknown error at type check for array rule, typeOfValue: ${typeOfValue}, value: ${JSON.stringify(value)}`,
			}
		}

		// units
		case 'number':
			{
				if (typeof nodeInput.type === 'object' && nodeInput.type.units) {
					if (typeOfValue === 'object') return { value: `${value.value}${value.unit}` }
					if (typeOfValue === 'number') return { value: `${value}${nodeInput.type.defaultUnit}` }
					if (typeOfValue === 'string') return { value }
				} else if (typeOfValue === 'number') return { value }
				else
					return {
						error: `Input "${dn}" should be number type, got "${typeOf(value)}"`,
					}
			}
			break

		case 'proplist': {
			if (value[0]?.id) return { value: value.map((i: any) => i.label) }
			else return { value }
		}

		case 'color': {
			if (typeOfValue === 'string') return { value: value }
			else
				return {
					error: `Input "${dn}" should be string type, got "${typeOf(value)}"`,
				}
		}

		case 'component': {
			if (typeOfValue === 'string') return { value: value }
			else
				return {
					error: `Input "${dn}" should be string type, got "${typeOf(value)}"`,
				}
		}

		case 'enum':
			return { value }
		case '*':
			return { value }

		default: {
			if (inputType === typeOfValue) return { value }
			else
				return {
					error: `Input "${dn}" should be "${inputType}" type, got "${typeOf(value)}"`,
				}
		}
	}
}
