import { isMantineColorScheme, type MantineColorScheme, type MantineColorSchemeManager } from '@mantine/core';

export default {
	get: (defaultValue) => {
		if (typeof window === 'undefined') {
			return defaultValue;
		}

		try {
			return (R.db?.states.params.colorScheme as MantineColorScheme) || defaultValue;
		} catch {
			return defaultValue;
		}
	},

	set: async (value) => {
		try {
			await R.db?.states.params.set('colorScheme', () => value);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('[@mantine/core] Local storage color scheme manager was unable to save color scheme.', error);
		}
	},

	subscribe: (onUpdate) => {
		R.db?.states.params.colorScheme$.subscribe((colorScheme: MantineColorScheme) => {
			isMantineColorScheme(colorScheme) && onUpdate(colorScheme);
		});
	},

	unsubscribe: () => {
		//window.removeEventListener('storage', handleStorageEvent);
	},

	clear: async () => {
		await R.db?.states.params.set('colorScheme', () => undefined);
	},
} as MantineColorSchemeManager;
