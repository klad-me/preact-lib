import { useEffect, Inputs } from "preact/hooks";


/**
 * Хук-обертка для setInterval()
 * @param cb обработчик
 * @param interval период запуска (мс)
 * @param inputs зависимости
 * @param runAtStart требуется ли запустить обработчик сразу
 */
export function useInterval(cb: () => void, interval: number, inputs?: Inputs, runAtStart?: boolean)
{
	useEffect( () => {
		if (runAtStart) cb();
		let iv=setInterval(cb, interval);
		return () => clearInterval(iv);
	}, inputs || [])
}