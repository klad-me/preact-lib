import { useCallback } from 'preact/hooks';
import { TextField, TextFieldOnInput, TextFieldValidator } from './TextField';
import { Event } from 'hooks';


export type NumberFieldValidator = (value: number) => boolean;

export type NumberFieldOnInput = (value: number) => void;

export type NumberFieldProps =
{
	value: number | undefined;
	onInput?: NumberFieldOnInput;
	dp?: number;
	validator?: NumberFieldValidator;
	min?: number;
	max?: number;
	style?: string;
	clickEvent?: Event<unknown>;
};


export function NumberField(props: NumberFieldProps)
{
	const dp=props.dp || 0;
	let value = ('number' == typeof props.value) ? Number(props.value).toFixed(dp) : undefined;
	let onInput: TextFieldOnInput;
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