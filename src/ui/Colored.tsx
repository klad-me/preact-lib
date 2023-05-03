import clsx from 'clsx';
import S from './Colored.module.scss';


/**
 * Аттрибуты для \<Colored/>
 */
export type ColoredProps = {
	/** Отображаемое значение */
	value: string;
	/** Флаг раскрасски в красный цвет */
	red?: boolean;
	/** Флаг раскрасски в желтый цвет */
	yellow?: boolean;
	/** Флаг раскрасски в зеленый цвет */
	green?: boolean;
}


/**
 * Отображает текстовое значение с опциональной раскрасской фона в красный/желтый/зеленый цвет.
 * @param props аттрибуты
 * @returns 
 */
export function Colored(props: ColoredProps)
{
	return <span class={clsx(props.red && S.red, props.yellow && S.yellow, props.green && S.green)}>{props.value}</span>;
}
