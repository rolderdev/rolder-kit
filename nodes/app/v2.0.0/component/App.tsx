import { forwardRef, useEffect } from 'react';
import type { Props } from '../node/definition';
import { ErrorBoundary } from 'react-error-boundary';
import initLocalDb from './initLocalDb';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.1.0';
import hyperdx from './hyperdx';

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

export default forwardRef(function (props: Props) {
	const {
		stopLoaderAnimationOn = 'authInitialized',
		project,
		projectVersion,
		projectDefaults,
		environment = 'd2',
	} = Noodl.getProjectSettings();
	const { noodlNode, multiInstance } = props;
	const { set } = R.libs.just;

	set(R, ['env', 'environment'], environment);
	set(R, ['env', 'project'], project);
	set(R, ['env', 'projectVersion'], projectVersion);
	try {
		if (projectDefaults) set(R, ['params', 'defaults'], eval(projectDefaults));
	} catch (error) {
		log.error('Project defaults error:', error);
	}

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
