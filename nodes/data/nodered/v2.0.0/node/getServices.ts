import initState from '@shared/init-state-v0.1.0'
import ky from 'ky'

export type Services = Record<
	string,
	{
		isDefault?: boolean
		nameForLabel: string
		serviceVersion: { label: string; value: string }[]
		defaultServiceVersion: string
	}
>

export const getServices = async () => {
	// Ожидаем подключения к Kuzzle
	await initState('initialized')

	// Получаем параметры подключения к nodered из R
	const noderedCreds = R.params.creds?.find((i) => i.name === 'nodered')?.data

	if (!noderedCreds) return

	// Ссылка для получения сервисов
	const servicesUrl = 'https://service-manager.services.d2.rolder.app/serviceManager_v1.1.0'

	// Получаем данные о сервисах
	return ky
		.post(servicesUrl, {
			headers: {
				Authorization: 'Basic ' + btoa(`${noderedCreds.username}:${noderedCreds.password}`),
			},
			body: null,
		})
		.json() as Promise<Services>
}
