import { useCallback } from 'preact/hooks';
import { TextField, TextFieldProps } from './TextField';


/**
 * Отображает или позволяет ввести IP-адрес (как текст)
 * @param props аттрибуты
 * @returns 
 */
export function IPField(props: TextFieldProps)
{
	const validator = useCallback( (value: string) => {
		if ( ('function' == typeof props.validator) && (! props.validator(value)) ) return false;
		if (! value.match(/^\d+\.\d+\.\d+\.\d+$/)) return false;
		return value.split('.').reduce( (acc, value) => ( acc && (parseInt(value) >= 0) && (parseInt(value) <= 255) ), true );
	}, [props.validator])

	return <TextField {...props} validator={validator} />;
}