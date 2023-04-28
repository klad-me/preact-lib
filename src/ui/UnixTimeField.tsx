import { useCallback, useMemo } from "preact/hooks";
import { DateTimeField } from "./DateTimeField";
import { Event } from "../hooks";


type UnixTimeFieldProps = {
	value?: number;
	seconds?: boolean;
	onInput: (value: number) => void;
	utc?: boolean;
	clickEvent?: Event<unknown>;
};


export function UnixTimeField(props: UnixTimeFieldProps)
{
	const tzOffset=props.utc ? 0 : (new Date()).getTimezoneOffset()*60;
	const value = useMemo( () => (props.value !== undefined) ? new Date((props.value+tzOffset)*1000) : undefined, [props.value, tzOffset] );
	const onInput = useCallback( (value: Date) => {
		props.onInput(Math.floor(value.getTime() / 1000) - tzOffset);
	}, [props.onInput, tzOffset]);

	return <DateTimeField value={value} onInput={('function' == typeof props.onInput) ? onInput : undefined} seconds={props.seconds} clickEvent={props.clickEvent} />
}