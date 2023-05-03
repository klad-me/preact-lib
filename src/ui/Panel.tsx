import S from './Panel.module.scss';
import './Icons.css';
import { ComponentChildren } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import clsx from 'clsx';


/** Аттрибуты для \<Panel/> */
export type PanelProps = {
	/** Заголовок панели */
	title: string;
	/** Обработчик клика по заголовку */
	onHeaderClick?: () => void;
	/** Требуется ли возможность сворачивания в заголовок */
	toggleable?: boolean;
	/** Если false, то по-умолчанию панель будет свернута */
	open?: boolean;
	/** Содержимое панели */
	children?: ComponentChildren;
};


/**
 * Отображает панель с заголовком
 * @param props аттрибуты
 * @returns 
 */
export function Panel(props: PanelProps)
{
	const [ open, setOpen] = useState((props.open !== undefined) ? props.open : true);

	const toggleOpen = useCallback( () => {
		setOpen(! open);
	}, [open]);

	return (
		<div class={S.panel}>
			<header class={clsx(S.header, props.toggleable && S.toggleable)} onClick={props.toggleable ? toggleOpen : props.onHeaderClick}>
				<span class={S.title}>{props.title}</span>
				{ ( props.toggleable && ! open ) ? <span class={clsx(S.downArrow, "icon-down-big")} /> : null }
			</header>
			<div class={clsx(S.container, (! open) && 'hide')}>
				{props.children}
			</div>
		</div>
	);
}
