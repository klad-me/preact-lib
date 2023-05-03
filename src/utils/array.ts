
/**
 * Функция для создания массива
 * @param size размер
 * @param cb функция создания элемента
 * @param current текущий массив, если он есть (иначе будет создан новый)
 * @param from иденкс, с которого начинать создавать элементы
 * @returns массив
 */
export function makeArray<T>(size: number, cb: (index: number) => T, current?: T[], from?: number): T[]
{
	let A: T[]=current ?? [];
	if (from === undefined) from=0;
	for (let i=from; i<size; i++)
		A[i]=cb(i)
	return A;
}
