import '@shared/types-v0.1.0';

export function dbClassVersion(dbClass?: string) {
	if (!dbClass) return false;
	else if (dbClass && !R.dbClasses?.[dbClass]?.version && dbClass !== 'user') {
		R.libs.mantine?.MantineError('Системная ошибка!', `No DB class with name "${dbClass}" at R.dbClasses`);
		log.error(`No DB class with name "${dbClass}" at R.dbClasses`, R.dbClasses);
		return false;
	} else return dbClass === 'user' ? 'user' : `${dbClass}_v${R.dbClasses?.[dbClass].version}`;
}
