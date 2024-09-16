import ms from 'ms';
import { getPortDef } from '@shared/port-v1.0.0';
import type { InspectInfo, ReactNodeDef } from '@shared/node-v1.0.0';
import type { BaseReactProps } from '@shared/node-v1.0.0';
import initState from '@shared/init-state-v0.1.0';
import initLocalDb from './app/initLocalDb';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.2.0';
import initNetwork from './app/initNetwork';
import initHyperdx from './app/initHyperdx';
import initKuzzle from './kuzzle/initKuzzle';
import initAuth from './auth/initAuth';

export type Props = BaseReactProps & {
	multiInstance?: boolean;
	useBackend: boolean;
	useAuth?: boolean;
	dbName: string;
	backendDevMode?: boolean;
	backendUrl?: string;
	backendPort?: number;
	sessionTimeout: string;
	username?: string;
	password?: string;
	store: AuthStore;
};

export type { Kuzzle, JSONObject, ResponsePayload, DocumentNotification } from 'kuzzle-sdk';
export type AuthStore = { signedIn: boolean | undefined; isLeader: boolean; refreshInterval?: NodeJS.Timeout };

import { createBlob } from 'rxdb';
type Rxdb = { createBlob: typeof createBlob };
export type { Rxdb };
export type { RxDatabase } from 'rxdb';

// Поскольку HyperDX не используется в коде с этого статичного импорта, он не попадает в этот файл.
import type HyperDX from '@hyperdx/browser';
type HyperDX = typeof HyperDX;
export type { HyperDX };

import Comp from '../component/App';

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inputs: [
		getPortDef({
			name: 'multiInstance',
			displayName: 'Multi DB instance',
			group: 'Custom',
			customGroup: 'Local DB',
			type: 'boolean',
			default: true,
			visibleAt: 'editor',
		}),
		getPortDef({
			name: 'useBackend',
			displayName: 'Use backend',
			group: 'Custom',
			customGroup: 'Backend',
			type: 'boolean',
			visibleAt: 'editor',
			default: true,
		}),
		getPortDef({
			name: 'dbName',
			displayName: 'DB name',
			group: 'Custom',
			customGroup: 'Backend',
			type: 'string',
			visibleAt: 'editor',
			dependsOn: (p: Props) => p.useBackend,
			validate: (p: Props) => (p.useBackend ? (p.dbName ? true : false) : true),
		}),
		getPortDef({
			name: 'backendDevMode',
			displayName: 'Backend dev mode',
			group: 'Custom',
			customGroup: 'Backend',
			type: 'boolean',
			default: false,
			visibleAt: 'editor',
			dependsOn: (p: Props) => p.useBackend,
		}),
		getPortDef({
			name: 'backendUrl',
			displayName: 'Backend url',
			group: 'Custom',
			customGroup: 'Backend',
			type: 'string',
			default: 'localhost',
			visibleAt: 'editor',
			dependsOn: (p: Props) => (p.backendDevMode ? true : false),
			validate: (p: Props) => (p.useBackend && p.backendDevMode ? (p.backendUrl ? true : false) : true),
		}),
		getPortDef({
			name: 'backendPort',
			displayName: 'Backend port',
			group: 'Custom',
			customGroup: 'Backend',
			type: 'number',
			default: 7512,
			dependsOn: (p: Props) => (p.backendDevMode ? true : false),
			validate: (p: Props) => (p.useBackend && p.backendDevMode ? (p.backendPort ? true : false) : true),
		}),
		getPortDef({
			name: 'useAuth',
			displayName: 'Use auth',
			group: 'Custom',
			customGroup: 'Auth',
			type: 'boolean',
			visibleAt: 'editor',
			default: true,
			dependsOn: (p: Props) => (p.useBackend ? true : false),
		}),
		getPortDef({
			name: 'sessionTimeout',
			displayName: 'Session timeout',
			group: 'Custom',
			customGroup: 'Auth',
			type: 'string',
			default: '5d',
			visibleAt: 'editor',
			dependsOn: (p: Props) => (p.useAuth ? true : false),
			validate: (p: Props) =>
				p.backendDevMode && p.useAuth
					? p.sessionTimeout && ms(p.sessionTimeout) >= 360000
						? true
						: 'Session timeout must 1 hour or greater'
					: true,
		}),
		getPortDef({
			name: 'username',
			displayName: 'Username',
			group: 'Custom',
			customGroup: 'Auth',
			type: 'string',
			visibleAt: 'connection',
			dependsOn: (p: Props) => (p.useAuth ? true : false),
		}),
		getPortDef({
			name: 'password',
			displayName: 'Password',
			group: 'Custom',
			customGroup: 'Auth',
			type: 'string',
			visibleAt: 'connection',
			dependsOn: (p: Props) => (p.useAuth ? true : false),
		}),
		getPortDef({ name: 'signIn', displayName: 'Sign in', group: 'Custom', customGroup: 'Auth', type: 'signal' }),
	],
	outputs: [
		getPortDef({ name: 'networkConnected', displayName: 'Connected', group: 'Custom', customGroup: 'Network', type: 'boolean' }),
		getPortDef({ name: 'networkType', displayName: 'Type', group: 'Custom', customGroup: 'Network', type: 'string' }),
		getPortDef({ name: 'userRole', displayName: 'User role', group: 'Custom', customGroup: 'Auth', type: 'string' }),
		getPortDef({ name: 'signingIn', displayName: 'Signing in', group: 'Custom', customGroup: 'Auth', type: 'boolean' }),
		getPortDef({ name: 'signedIn', displayName: 'Signed in', group: 'Custom', customGroup: 'Auth', type: 'signal' }),
		getPortDef({ name: 'signedOut', displayName: 'Signed out', group: 'Custom', customGroup: 'Auth', type: 'signal' }),
	],
	getInspectInfo: (p, outProps, noodlNode) => {
		let inspectInfo: InspectInfo[] = [];
		if (noodlNode._internal.connected)
			inspectInfo.push({ type: 'value', value: `Network connected: ${noodlNode._internal.connected}` });
		if (noodlNode._internal.connectionType)
			inspectInfo.push({ type: 'value', value: `Network type: ${noodlNode._internal.connectionType}` });
		if (p.useBackend) {
			inspectInfo.push({ type: 'value', value: `DB: ${p.dbName}` });
			if (noodlNode._internal.host && noodlNode._internal.port)
				inspectInfo.push({ type: 'value', value: `Host: ${noodlNode._internal.host}:${noodlNode._internal.port}` });
		}
		if (p.useAuth && R.db?.states?.auth) {
			inspectInfo.push({ type: 'value', value: `Signed in: ${R.db.states.auth.signedIn}` });
			inspectInfo.push({ type: 'value', value: `User: ${R.user ? R.user : 'none'}` });
		}

		return inspectInfo;
	},
	initialize: async (p: Props, noodlNode) => {
		// Дождемся библиотек и утилит.
		await initState('shared');

		const { project, projectVersion, projectDefaults, environment = 'd2' } = Noodl.getProjectSettings();
		const { set } = R.libs.just;

		set(R, ['env', 'environment'], environment);
		set(R, ['env', 'project'], project);
		set(R, ['env', 'projectVersion'], projectVersion);
		try {
			if (projectDefaults) set(R, ['params', 'defaults'], eval(projectDefaults));
		} catch (error) {
			log.error('Project defaults error:', error);
		}

		// Создадим локульную БД для хранения состояния приложения и для возможного offline сценария.
		await initLocalDb(p.multiInstance);
		// Установим прогресс анимации.
		systemLoaderAnimation.progress(33);
		// Изменим реактивное состояние инициализации приложения.
		R.states.init.value = 'localDb';

		// Инициализируем сеть.
		await initNetwork(noodlNode);
		R.states.init.value = 'network';

		// Нициализицуем бекенд, если нужно. // Внтури динамичный импорт, чтобы не загружать, когда не включено.
		if (p.useBackend) await initKuzzle(p, noodlNode);
		systemLoaderAnimation.progress(66);
		R.states.init.value = 'backend';
		// Небольшая задержка, чтобы прогресс успел заполниться.
		await new Promise((r) => setTimeout(r, 10));

		if (p.useAuth) await initAuth(p, noodlNode);
		// Нужно дождаться не выполнения, а состояния.
		await new Promise((resolve) => {
			const interval = setInterval(async () => {
				if (R.db.states.auth.inited) {
					clearInterval(interval);
					resolve(undefined);
				}
			}, 50);
		});

		systemLoaderAnimation.progress(100);
		R.states.init.value = 'auth';
		await new Promise((r) => setTimeout(r, 10));

		// Инициализируем отправку логов. Сделаем это послде проверки авторизации, чтобы добавить информацию о пользователе сразу, если есть.
		// Внтури динамичный импорт, чтобы не загружать, когда не включено.
		await initHyperdx();

		log.info('R', R);
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;
