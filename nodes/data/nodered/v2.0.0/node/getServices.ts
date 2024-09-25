import ky from 'ky';

export type Services = Record<
	string,
	{
		isDefault?: boolean;
		nameForUrl: string;
		nameForlabel: string;
		serviceVersion: { label: string; value: string }[];
		defaultServiceVersion: string;
	}
>;

export const getServices = async () => {
	// Получаем параметры подключения к nodered из R
	const noderedCreds = R.params.creds?.filter((i) => i.name === 'nodered')?.[0].data;

	if (!noderedCreds) return;

	// Ссылка для получения сервисов
	const servicesUrl = 'https://service-manager.services.d2.rolder.app/serviceManager_v1.0.0';

	// Получаем данные о сервисах
	return ky
		.post(servicesUrl, {
			headers: {
				Authorization: 'Basic ' + btoa(`${noderedCreds.username}:${noderedCreds.password}`),
			},
			body: null,
		})
		.json() as Promise<Services>;
};
