export default async function (ErrorBoundary: any) {
	const configState = await R.db?.addState('config');
	configState.options$.subscribe((options?: { name: string; data: any }[]) => {
		if (options?.length) {
			const remoteLogs = options.find((i) => i.name === 'remoteLogs')?.data?.enabled;
			const apiKey = configState.creds?.find((i: any) => i.name === 'hyperdx')?.data.apiKey;
			if (remoteLogs && apiKey) {
				import('@hyperdx/browser').then(async (HyperDX) => {
					const { project, environment, projectVersion } = R.env;
					if (project && environment && projectVersion) {
						HyperDX.default.init({
							apiKey,
							service: `${project}-${environment}-${location.hostname}`,
							//tracePropagationTargets: [/rolder.app/i], // Чет с CORS нужно ковырять.
							consoleCapture: true,
							advancedNetworkCapture: true,
						});
						// Пересылает логи React в HyperDX.
						HyperDX.default.attachToReactErrorBoundary(ErrorBoundary);
						HyperDX.default.setGlobalAttributes({ environment, project, projectVersion, rolderKit: R.env?.rolderKit || 'none' });
						// Добавим информацию о пользователе в логи если авторизаван.
						const authState = await R.db?.addState('auth');
						if (authState.signedIn && authState.user)
							HyperDX.default.setGlobalAttributes({
								userId: authState.user.id,
								userData: JSON.stringify(authState.user),
								userEmail: authState.user.id,
							});
						window.HyperDX = HyperDX.default;
					}
				});
			} else window.HyperDX = undefined;
		}
	});

	// Добавим информацию о пользователе в логи после авторизации.
	const authState = await R.db?.addState('auth');
	authState.$.subscribe((authState: any) => {
		if (authState.signedIn && authState.user && window.HyperDX)
			HyperDX.setGlobalAttributes({
				userId: authState.user.id,
				userData: JSON.stringify(authState.user),
				userEmail: authState.user.id,
			});
	});
}
