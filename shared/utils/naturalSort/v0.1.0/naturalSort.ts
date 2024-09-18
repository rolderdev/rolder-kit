// Сортирует "натуральной" сортировкой, доступной в самом JS через localeCompare - https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
import '@shared/types-v0.1.0';

export default function (originalArray: any[], sortPath: string, direction: 'asc' | 'desc') {
	const { get } = R.libs.just;

	// Создает функцию для сравнения. Рекомендованор в документации для больших массивов. В даном случае:
	// 1. Учитывает, что слова могут быть русские или английские.
	// 2. Сортирует номера привычным для человека образом.
	// 3. Игнорирует регистр.
	const compare = new Intl.Collator(['ru', 'en'], { numeric: true, sensitivity: 'base' }).compare;

	// Для .sort нужен клон, но не глубокий, чтобы не убивать прокси.
	return [...originalArray].sort((a, b) =>
		compare(get(direction === 'asc' ? a : b, sortPath), get(direction === 'asc' ? b : a, sortPath))
	);
}
