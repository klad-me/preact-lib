import S from './RowItem.module.scss';
import { useEvent, Event } from '../hooks';
import { ComponentChildren, toChildArray, VNode } from 'preact';
import clsx from 'clsx';


/**
 * Аттрибуты для \<RowItem/>
 */
export type RowItemProps = {
	/** Название */
	name: string;
	/** Значение в виде строки, если undefined - значение берется из children */
	value?: string;
	/** Единица измерения, если undefined - выделенного поля не будет */
	unit?: string;
	/** Обработчик клика */
	onClick?: () => void;
	/** Можно ли кликать по элементу (будет меняться курсор) */
	clickable?: boolean;
	/** Значение */
	children?: ComponentChildren;
};


/**
 * Отображает строку, содержащую 3 части: название (выравнено влево), значение (выравнено вправо) и единица измерения (отдельное поле справа с выравниванием влево).<br/>
 * Отправляет событие clickEvent при клике на элемент (событие может обработать элемент-значение).
 * @param props аттрибуты
 * @returns 
 */
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