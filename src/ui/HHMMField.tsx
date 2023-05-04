import { zeroPad } from "../utils";
import { TextField } from "./TextField";
import { useCallback } from "preact/hooks";
import { Event } from "../hooks";


function hhmmValidator(value: string): boolean
{
	if (! value.match(/^\d+:\d+$/)) return false;
	const [ hh, mm ] = value.split(':').map(Number);
	return (hh <= 23) && (mm <= 59);
}


/**
 * Аттрибуты для \<HHMMField/>
 */
export type HHMMFieldProps = {
	/** Значение ЧЧ*60+ММ */
	value: number | undefined;
	/** Обработчик ввода, если не определен - значение readonly */
	onInput?: (value: number) => void;
	/** Стиль для \<input/> */
	style?: string;
	/** Событие для открытия редактора */
	clickEvent?: Event<unknown>;
};


/**
 * Отображает и редактирует значение ЧЧ:ММ, хранимое в числе в формате ЧЧ*60+ММ
 * @param props аттрибуты
 * @returns 
 */
export function HHMMField(props: HHMMFieldProps)
{
	const value=(props.value !== undefined) ? (zeroPad(~~(props.value / 60), 2) + ':' + zeroPad(props.value % 60, 2)) : undefined;
	const onInput = useCallback( (value: string) => {
		const [ hh, mm ] = value.split(':').map(Number);
		('function' == typeof props.onInput) && props.onInput(hh*60+mm);
	}, [props.onInput]);

	return <TextField value={value} onInput={('function' == typeof props.onInput) ? onInput : undefined} validator={hhmmValidator} inputMode="decimal" style={props.style ?? "width: 4rem"} clickEvent={props.clickEvent} />;
}