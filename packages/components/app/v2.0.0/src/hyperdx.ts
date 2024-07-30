export default async function (ErrorBoundary: any) {
	const configState = await R.db?.addState('config');

	configState.options$.subscribe((options?: { name: string; data: any }[]) => {
		if (options) {
			const remoteLogs = options.find((i) => i.name === 'remoteLogs')?.data?.enabled;
			if (remoteLogs) {
				import('@hyperdx/browser').then((HyperDX) => {
					const { project, environment, projectVersion } = R.env;
					if (project && environment && projectVersion) {
						HyperDX.default.init({
							apiKey: '5cc47e8f-651a-44a8-a251-bc9b1e3f4e05',
							service: `${project}-${environment}-${location.hostname}`,
							//tracePropagationTargets: [/rolder.app/i], // Чет с CORS нужно ковырять.
							consoleCapture: true,
							advancedNetworkCapture: true,
						});
						// Пересылает логи React в HyperDX.
						HyperDX.default.attachToReactErrorBoundary(ErrorBoundary);
						HyperDX.default.setGlobalAttributes({ environment, project, projectVersion, rolderKit: R.env?.rolderKit || 'none' });
						window.HyperDX = HyperDX.default;
					}
				});
			} else window.HyperDX = undefined;
		}
	});
}
