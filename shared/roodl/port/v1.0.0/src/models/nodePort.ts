// Модель порта ноды. Определяет схему порта, которая регистрируется в ноде Roodl. Здесь нет проверок типов данных.

import { array, boolean, brand, number, object, optional, parse, pick, picklist, pipe, string, type InferOutput } from 'valibot';
import { PortDef } from './portDefinition';

// Возьмем с модели порта повторяющиеся параметры.
const pd = pick(object(PortDef.entries), ['name', 'displayName', 'default', 'tooltip']);
// Подготовим схему порта, которую съест Roodl.
export const NodePortSchema = pipe(
	object({
		plug: picklist(['input', 'output']),
		index: optional(number()),
		group: string(),
		...pd.entries,
		// Т.к. работать мы больше будем с PortDef, здесь задаем тип не литералом, а широким форматом, чтобы был стандарт.
		type: object({
			// В отличии от PortDef, здесь только поддерживемые Roodl и используемые нами.
			name: picklist(['*', 'string', 'number', 'boolean', 'array', 'object', 'signal', 'enum', 'proplist', 'component']),
			//multiline: optional(boolean()), // Для текстового поля.
			enums: optional(array(object({ value: string(), label: string() }))),
			allowEditOnly: optional(boolean()),
			allowConnectionsOnly: optional(boolean()),
		}),
	}),
	brand('NodePort')
);

export type NodePort = InferOutput<typeof NodePortSchema>;

export const getNodePort = (plug: NodePort['plug'], portDef: PortDef) => {
	let nodePort: Partial<NodePort> = {
		plug,
		name: portDef.name,
		displayName: portDef.displayName,
		group: portDef.group,
	};

	// Может быть 0.
	if (portDef.default !== undefined) nodePort.default = portDef.default;
	if (portDef.tooltip) nodePort.tooltip = portDef.tooltip;

	// Преобразуем тип порта для Roodl.
	if (typeof portDef.type === 'string') {
		if (['objectEval', 'funcEval'].includes(portDef.type)) nodePort.type = { name: 'array' };
		else nodePort.type = { name: portDef.type as any };
	} else nodePort.type = { name: 'enum', enums: portDef.type };

	// Установим видимость порта.
	if (portDef.visibleAt === 'connection') nodePort.type.allowConnectionsOnly = true;
	if (portDef.visibleAt === 'editor') nodePort.type.allowEditOnly = true;
	// Запретим подавать proplist через подключение.
	if (portDef.type === 'proplist') nodePort.type.allowEditOnly = true;

	return parse(NodePortSchema, nodePort);
};
