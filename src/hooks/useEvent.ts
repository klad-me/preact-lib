import { useMemo, useEffect, Inputs } from "preact/hooks";


export type EventCallback<ArgType> = (arg: ArgType) => void;


/**
 * Событие, на которое можно подписаться
 */
export class Event<ArgType>
{
	protected list = new Set<EventCallback<ArgType>>();

	constructor()
	{
	}

	/**
	 * Подписаться на активацию события. Для удобства использования в useEffect() возвращает функцию для отписки
	 * @param cb обработчик
	 * @returns функция для отписки
	 */
	on(cb: EventCallback<ArgType>): (() => void)
	{
		this.list.add(cb);
		return () => {
			this.list.delete(cb);
		}
	}

	/**
	 * Отписаться от события
	 * @param cb 
	 */
	off(cb: EventCallback<ArgType>): void
	{
		this.list.delete(cb);
	}

	/**
	 * Хук для автоматической подписки/отписки на событие
	 * @param cb обработчик
	 * @param inputs зависимости
	 */
	use(cb: EventCallback<ArgType>, inputs?: Inputs): void
	{
		useEffect( () => {
			return this.on(cb);
		}, [inputs]);
	}

	/**
	 * Активировать событие
	 * @param arg значение события
	 */
	emit = (arg: ArgType): void =>
	{
		this.list.forEach( (cb) => cb(arg) );
	}
};


/**
 * Создает и возвращает событие
 * @returns событие
 */
export function useEvent<ArgType>()
{
    return useMemo( () => new Event<ArgType>(), [] );
}
