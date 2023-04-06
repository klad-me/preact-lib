import { useRef, useEffect, useCallback, Inputs } from "preact/hooks";


type setFn = (ms?: number | unknown) => void;
type resetFn = () => void;
type useTimeoutResult = [ setFn, resetFn ];


export function useTimeout(cb: () => void, inputs?: Inputs, defaultTimeout?: number): useTimeoutResult
{
	const timer = useRef<any>();

	const reset = useCallback( () => {
		if (timer.current !== undefined)
			clearTimeout(timer.current);
	}, inputs);

	const set = useCallback( (ms?: number) => {
		reset();
		timer.current = setTimeout(cb, ('number' == typeof ms) ? ms : defaultTimeout);
	}, inputs);

	useEffect(() => reset, inputs);

	return [ set, reset ];
}