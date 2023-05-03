import { useCallback } from 'preact/hooks';
import { TextField, TextFieldOnInput, TextFieldValidator } from './TextField';
import { Event } from '../hooks';


/** Функция-валидатор значения для \<NumberField/> */
export type NumberFieldValidator = (value: number) => boolean;

/** Функция-обработчик ввода для \<NumberField/> */
export type NumberFieldOnInput = (value: number) => void;

/** Аттрибуты для \<NumberField/> */
export type NumberFieldProps =
{
	/** Значение */
	value: number | undefined;
	/** Обработчик ввода, если не указан - значение readonly */
	onInput?: NumberFieldOnInput;
	/** Количество точек после запятой */
	dp?: number;
	/** Валидатор для значения */
	validator?: NumberFieldValidator;
	/** Минимально допустимое значение */
	min?: number;
	/** Максимально допустимое значени */
	max?: number;
	/** Стиль для \<input/> */
	style?: string;
	/** Событие для открытия редактора */
	clickEvent?: Event<unknown>;
};


/**
 * Отображает и позволяет редактировать числовое значение
 * @param props аттрибуты
 * @returns 
 */
export function NumberField(props: NumberFieldProps)
{
	const dp=props.dp || 0;
	let value = ('number' == typeof props.value) ? Number(props.value).toFixed(dp) : undefined;
	let onInput: TextFieldOnInput | undefined;
	if (props.onInput)
	{
		const cb=props.onInput;
		onInput=useCallback( (value: string) => cb(Number(value.replace(',', '.'))), [cb]);
	}
	let validator: TextFieldValidator = useCallback( (value: string) => {
		value=value.replace(',', '.');
		if ( (dp==0) && (! value.match(/^-?\d+$/)) ) return false;
		if ( (dp!=0) && (! value.match(/^-?\d+(\.\d+)?$/)) ) return false;
		let num=Number(value);
		if ( ('function' == typeof props.validator) && (! props.validator(num)) ) return false;
		if ( ('number' == typeof props.min) && (num < props.min) ) return false;
		if ( ('number' == typeof props.max) && (num > props.max) ) return false;
		return true;
	}, [dp, props]);

	return <TextField value={value} onInput={onInput} validator={validator} style={props.style} clickEvent={props.clickEvent} inputMode="decimal" />;
}