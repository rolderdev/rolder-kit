import '@shared/types-v0.1.0';
import type { SchemeDbClass } from '@shared/types-v0.1.0';

export const getDbClassName = (dbClass: SchemeDbClass) => (typeof dbClass === 'string' ? dbClass : dbClass.name);

export const getVersionedDbClass = (dbClass?: SchemeDbClass) => {
	if (!dbClass) return false;
	else {
		const dbClassName = getDbClassName(dbClass);
		if (dbClassName === 'user') return 'user';
		else {
			if (!R.dbClasses?.[dbClassName]) {
				R.libs.mantine?.MantineError('Системная ошибка!', `No DB class with name "${dbClassName}" at R.dbClasses`);
				log.error(`No DB class with name "${dbClassName}" at R.dbClasses`, R.dbClasses);
				return false;
			} else
				return typeof dbClass === 'string'
					? `${dbClassName}_v${R.dbClasses[dbClassName].current}`
					: `${dbClass.name}_v${dbClass.version}`;
		}
	}
};
