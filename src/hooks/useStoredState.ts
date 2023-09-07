import { deepEqual } from "../utils";
import { useCallback, useState } from "preact/hooks";


type SetterArg<T> = T | ((prev: T) => T)
type Setter<T> = (arg: SetterArg<T>) => void;


export function useStoredState<T>(key: string, initialValue: T): [ T, Setter<T> ]
{
	const [ value, setValue ] = useState<T>( () => {
		const saved = window.localStorage.getItem(key);
		if (saved !== null)
			return JSON.parse(saved) as T; else
			return initialValue;
	});

	const setter = useCallback( (arg: SetterArg<T>): void => {
		let newValue: T;

		if ('function' == typeof arg)
		{
			// @ts-ignore
			newValue=arg(value);
		} else
		{
			newValue=arg;
		}
		
		if (deepEqual(value, newValue)) return;

		window.localStorage.setItem(key, JSON.stringify(newValue));
		setValue(newValue);
	}, [value]);

	return [ value, setter ];
}