import S from './RowItem.module.scss';
import { useEvent, Event } from '../hooks';
import { ComponentChildren, toChildArray, VNode } from 'preact';
import clsx from 'clsx';
import { prependOnceListener } from 'process';


interface RowItemProps
{
	name: string;
	value?: string;
	unit?: string;
	onClick?: () => void;
	clickable?: boolean;
	children?: ComponentChildren;
};

export function RowItem(props: RowItemProps)
{
	const ev = useEvent();

	let valueElement: ComponentChildren | string | undefined = props.value;

	if (valueElement === undefined)
	{
		valueElement=props.children;
		toChildArray(props.children).forEach( (el) => {
			if ('object' == typeof el)
				((el.props as unknown) as {clickEvent: Event<unknown>}).clickEvent=ev;
		});
	}

	return (
		<div class={clsx(S.row, (props.onClick || props.clickable) && S.clickable)} onClick={props.onClick}>
			<div class={S.name} onClick={ev.emit}>{props.name}</div>
			{(valueElement !== undefined) && <div class={S.value}>{valueElement}</div>}
			{(props.unit !== undefined) && <div class={S.unit} onClick={ev.emit}>{props.unit}</div>}
		</div>
	);
}