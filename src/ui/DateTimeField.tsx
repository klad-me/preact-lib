import { zeroPad } from '../utils';
import { TextField } from './TextField';
import { useCallback } from 'preact/hooks';
import { Event } from '../hooks';


const daysInMonth = [ 31,28,31,30,31,30,31,31,30,31,30,31 ];


function dateValidator(s: string): boolean
{
	if (! s.match(/^\d+\.\d+\.\d+$/)) return false;
	const [ date, month, year ] = s.split('.').map(Number);
	if ( (year < 1970) || (year > 2099) || (month < 1) || (month > 12) ) return false;
	let days = daysInMonth[month-1];
	if ( (month == 2) && ((year % 4) == 0) ) days++;
	return (date >= 1) && (date <= days);
}


function timeValidator(s: string): boolean
{
	if (! s.match(/^\d+:\d+(:\d+)?$/)) return false;
	const [ hour, min, sec ] = s.split(':').map(Number);
	return (hour <= 23) && (min <= 59) && (~~sec <= 59);
}


function dateTimeValidator(s: string): boolean
{
	const dt = s.split(/\s+/);
	if (dt.length != 2) return false;
	return dateValidator(dt[0]) && timeValidator(dt[1]);
}


/**
 * Аттрибуты для \<DateField/>, \<TimeField/> и \<DateTimeField/>
 */
export type DateTimeFieldProps = {
	/** Значение */
	value: Date | undefined;
	/** Требуется ли отображать секунды (по-умолчанию - да) */
	seconds?: boolean;
	/** Обработчик изменения значения, если не указан - значение readonly */
	onInput?: (value: Date) => void;
	/** Событие для открытия редактора */
	clickEvent?: Event<unknown>;
};


/**
 * Отображает и позволяет редактировать дату в формат ДД.ММ.ГГГГ
 * @param props аттрибуты
 * @returns 
 */
export function DateField(props: DateTimeFieldProps)
{
	const d=props.value;
	const value=(d !== undefined) ? (zeroPad(d.getDate(), 2) + '.' + zeroPad(d.getMonth()+1, 2) + '.' + zeroPad(d.getFullYear(), 4)) : undefined;

	const onInput = useCallback( (value: string) => {
		const [ date, month, year ] = value.split('.').map(Number);
		let d=new Date(props.value!);
		d.setFullYear(year);
		d.setMonth(month-1);
		d.setDate(date);
		('function' == typeof props.onInput) && props.onInput(d);
	}, [props.value, props.onInput]);

	return <TextField value={value} onInput={('function' == typeof props.onInput) ? onInput : undefined} validator={dateValidator} clickEvent={props.clickEvent} inputMode="decimal" />;
}


/**
 * Отображает и позволяет редактировать время в формате ЧЧ:ММ[:СС]
 * @param props аттрибуты
 * @returns 
 */
export function TimeField(props: DateTimeFieldProps)
{
	const seconds = (props.seconds ?? true);
	const d=props.value;
	const value=(d !== undefined) ? (zeroPad(d.getHours(), 2) + ':' + zeroPad(d.getMinutes(), 2) + (seconds ? (':' + zeroPad(d.getSeconds(), 2)) : '')) : undefined;

	const onInput = useCallback( (value: string) => {
		const [ hour, min, sec ] = value.split(':').map(Number);
		let d=new Date(props.value!);
		d.setHours(hour);
		d.setMinutes(min);
		d.setSeconds(~~sec);
		d.setMilliseconds(0);
		('function' == typeof props.onInput) && props.onInput(d);
	}, [props.value, props.onInput]);

	return <TextField value={value} onInput={('function' == typeof props.onInput) ? onInput : undefined} validator={timeValidator} clickEvent={props.clickEvent} inputMode="decimal" />;
}


/**
 * Отображает и позволяет редактировать дату и время в формате ДД.ММ.ГГГГ ЧЧ:ММ[:СС]
 * @param props аттрибуты
 * @returns 
 */
export function DateTimeField(props: DateTimeFieldProps)
{
	const seconds = (props.seconds ?? true);
	const d=props.value;
	const value=
		(d !== undefined) ? (
			zeroPad(d.getDate(), 2) + '.' + zeroPad(d.getMonth()+1, 2) + '.' + zeroPad(d.getFullYear(), 4) + '  ' +
			zeroPad(d.getHours(), 2) + ':' + zeroPad(d.getMinutes(), 2) + (seconds ? (':' + zeroPad(d.getSeconds(), 2)) : '') ) :
			undefined;

	const onInput = useCallback( (value: string) => {
		const [ strDate, strTime ] = value.split(/\s+/);
		const [ date, month, year ] = strDate.split('.').map(Number);
		const [ hour, min, sec ] = strTime.split(':').map(Number);
		let d=new Date(props.value!);
		d.setFullYear(year);
		d.setMonth(month-1);
		d.setDate(date);
		d.setHours(hour);
		d.setMinutes(min);
		d.setSeconds(~~sec);
		d.setMilliseconds(0);
		('function' == typeof props.onInput) && props.onInput(d);
	}, [props.value, props.onInput]);
	
	return <TextField value={value} onInput={('function' == typeof props.onInput) ? onInput : undefined} validator={dateTimeValidator} clickEvent={props.clickEvent} inputMode="decimal" />;
}
