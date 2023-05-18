import { Size } from "../types";
import { Ref, useEffect, useState } from "preact/hooks";


/**
 * Возвращает размер элемента и отслеживает его изменение
 * @param ref ссылка на элемент
 * @returns размер или undefined (пока размер неизвестен)
 */
export function useElementSize(ref: Ref<HTMLElement>): Size | undefined
{
	const [ size, setSize ] = useState<Size | undefined>(undefined);

	useEffect( () => {
		const el=ref.current;
		if (! el) return;

		const observer = new ResizeObserver( () => {
			setSize({ w: el.clientWidth, h: el.clientHeight });
		});
		observer.observe(el);

		return () => {
			observer.unobserve(el);
			setSize(undefined);
		};
	}, [ref]);

	return size;
}
