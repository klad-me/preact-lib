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


type HHMMFieldProps = {
	value: number;
	onInput: (value: number) => void;
	style?: string;
	clickEvent?: Event<unknown>;
};


export function HHMMField(props: HHMMFieldProps)
{
	const value=zeroPad(~~(props.value / 60), 2) + ':' + zeroPad(props.value % 60, 2);
	const onInput = useCallback( (value: string) => {
		const [ hh, mm ] = value.split(':').map(Number);
		props.onInput(hh*60+mm);
	}, [props.onInput]);

	return <TextField value={value} onInput={('function' == typeof props.onInput) && onInput} validator={hhmmValidator} inputMode="decimal" style={props.style} clickEvent={props.clickEvent} />;
}