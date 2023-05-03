import { useCallback, useMemo } from "preact/hooks";
import { DateTimeField } from "./DateTimeField";
import { Event } from "../hooks";


/** Аттрибуты для \<UnixTimeField/> */
export type UnixTimeFieldProps = {
	/** Значение */
	value?: number;
	/** Требуется ли выводить секунды, по-умолчанию да */
	seconds?: boolean;
	/** Обработчик ввода, если undefined - значение readonly */
	onInput: (value: number) => void;
	/** Значение unixtime в UTC или локальное время */
	utc?: boolean;
	/** Событие для открытия редактора */
	clickEvent?: Event<unknown>;
};


/**
 * Отображает и позволяет редактировать дату и время в формате unixtime
 * @param props аттрибуты
 * @returns 
 */
export function UnixTimeField(props: UnixTimeFieldProps)
{
	const tzOffset=props.utc ? 0 : (new Date()).getTimezoneOffset()*60;
	const value = useMemo( () => (props.value !== undefined) ? new Date((props.value+tzOffset)*1000) : undefined, [props.value, tzOffset] );
	const onInput = useCallback( (value: Date) => {
		props.onInput(Math.floor(value.getTime() / 1000) - tzOffset);
	}, [props.onInput, tzOffset]);

	return <DateTimeField value={value} onInput={('function' == typeof props.onInput) ? onInput : undefined} seconds={props.seconds} clickEvent={props.clickEvent} />
}