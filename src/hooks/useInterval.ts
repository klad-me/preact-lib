import { useEffect, Inputs } from "preact/hooks";


export function useInterval(cb: () => void, interval: number, deps: Inputs, runAtStart?: boolean)
{
	useEffect( () => {
		if (runAtStart) cb();
		let iv=setInterval(cb, interval);
		return () => clearInterval(iv);
	}, deps || [])
}