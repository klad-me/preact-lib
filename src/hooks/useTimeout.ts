import { useRef, useEffect, useCallback, Inputs } from "preact/hooks";


type setFn = (ms?: number | unknown) => void;
type resetFn = () => void;


/**
 * [ setFn(ms?), resetFn() ]<br/>
 * setFn(ms) - функция для запуска таймера<br/>
 * resetFn() - функция для останова таймера
 */
export type useTimeoutResult = [ setFn, resetFn ];


/**
 * Хук-обертка для setTimeout()/clearTimeout()
 * @param cb обработчик
 * @param inputs зависимости
 * @param defaultTimeout время по-умолчанию, если в setFn() не передано значение времени
 * @returns [ setFn(ms), resetFn() ]
 */
export function useTimeout(cb: () => void, inputs?: Inputs, defaultTimeout?: number): useTimeoutResult
{
	const timer = useRef<any>();

	if (! inputs) inputs=[];

	const reset = useCallback( () => {
		if (timer.current !== undefined)
			clearTimeout(timer.current);
	}, inputs);

	const set = useCallback( (ms?: number | unknown) => {
		reset();
		timer.current = setTimeout(cb, ('number' == typeof ms) ? ms : defaultTimeout);
	}, inputs);

	useEffect(() => reset, inputs);

	return [ set, reset ];
}