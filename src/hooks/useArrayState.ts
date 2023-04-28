import { StateUpdater, useState } from "preact/hooks";


type UseArrayStateResult<T> = [ T[], StateUpdater<T>[] ];


export function useArrayState<T>(length: number, init: T[]): UseArrayStateResult<T>
{
	const value: T[] = [], setValue: StateUpdater<T>[] = [];

	for (let i=0; i<length; i++)
	{
		[ value[i], setValue[i] ] = useState<T>(init[i]);
	}

	return [ value, setValue ];
}