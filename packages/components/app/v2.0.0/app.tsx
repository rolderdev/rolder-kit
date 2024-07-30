import { forwardRef, useEffect } from 'react';
import type { Props } from './types';
import { ErrorBoundary } from 'react-error-boundary';
import initLocalDb from './src/initLocalDb';
import systemLoaderAnimation from '@packages/system-loader-animation';
import hyperdx from './src/hyperdx';

function FallbackComponent({ error }: any) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: 'white',
				padding: 64,
			}}
		>
			<h2 style={{ color: 'red' }}>Системная ошибка!</h2>
			<h3>{error.message}</h3>
			<img
				src="error.jpg"
				style={{
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto',
					marginTop: 64,
					width: '50%',
				}}
			/>
		</div>
	);
}

export default forwardRef(function (props: Props, ref) {
	const {
		stopLoaderAnimationOn = 'authInitialized',
		project,
		projectVersion,
		projectDefaults,
		environment = 'd2',
	} = Noodl.getProjectSettings();
	const { noodlNode, multiInstance } = props;

	R.env.environment = environment;
	R.env.project = project;
	R.env.projectVersion = projectVersion;
	R.params.defaults = projectDefaults && eval(projectDefaults)?.[0];

	const localDbInited = initLocalDb(noodlNode, multiInstance);
	useEffect(() => {
		if (localDbInited) {
			// Запустим мониторинг настроек. Когда бекенд скачает настройки, каждая функция поймает их и примет соотвествующие решения.
			hyperdx(ErrorBoundary);
			// Остановим анимацию, если так настроено.
			if (stopLoaderAnimationOn === 'appInitialized') systemLoaderAnimation.stop();
		}
	}, [localDbInited]);

	return (
		<ErrorBoundary FallbackComponent={FallbackComponent}>
			<div
				style={{
					width: '100%',
					height: '100%',
				}}
			>
				{localDbInited ? props.children : null}
			</div>
		</ErrorBoundary>
	);
});
