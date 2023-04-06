import S from './RowItem.module.scss';
import { useEvent, Event } from '../hooks';
import { ComponentChildren, toChildArray, VNode } from 'preact';


interface RowItemProps
{
	name: string;
	value?: string;
	unit?: string;
	onClick?: () => void;
	children?: ComponentChildren;
};

export function RowItem({name, value, unit, children, onClick}: RowItemProps)
{
	const ev = useEvent();

	let valueElement: ComponentChildren | string | undefined = value;

	if (valueElement === undefined)
	{
		valueElement=children;
		toChildArray(children).forEach( (el) => {
			if ('object' == typeof el)
				((el.props as unknown) as {clickEvent: Event<unknown>}).clickEvent=ev;
		});
	}

	return (
		<div class={S.row} onClick={onClick}>
			<div class={S.name} onClick={ev.emit}>{name}</div>
			{(valueElement !== undefined) && <div class={S.value}>{valueElement}</div>}
			{(unit !== undefined) && <div class={S.unit} onClick={ev.emit}>{unit}</div>}
		</div>
	);
}