import '@shared/types-v0.1.0';
import { reactNode } from '@shared/node-v1.0.0';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.1.0';

// css loader
import './src/loader.css';
systemLoaderAnimation.start();

const app = reactNode(
	'App',
	{
		'v2.0.0': (await import('@nodes/app-v2.0.0')).default,
	},
	{ allowChildren: true, docs: '' }
);

Noodl.defineModule({ reactNodes: [app] });
