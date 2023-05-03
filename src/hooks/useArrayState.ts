import { StateUpdater, useState } from "preact/hooks";


export type UseArrayStateResult<T> = [ T[], StateUpdater<T>[] ];


/**
 * Работает аналогично хуку useState(), только создает указанное количество состояний (массив)
 * @param length количество состояний
 * @param init начальные значения
 * @returns [ T[], StateUpdater<T>[] ]
 */
export function useArrayState<T>(length: number, init: T[]): UseArrayStateResult<T>
{
	const value: T[] = [], setValue: StateUpdater<T>[] = [];

	for (let i=0; i<length; i++)
	{
		[ value[i], setValue[i] ] = useState<T>(init[i]);
	}

	return [ value, setValue ];
}