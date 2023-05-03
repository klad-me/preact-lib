import S from './GridContainer.module.scss';
import { ComponentChildren } from 'preact';


type GridContainerProps = {
	children: ComponentChildren;
};


/**
 * Создает контейнер с сеткой в 2 столбца (в ландшафтной ориентации) или в 1 столбец (в портретной ориентации)
 * @returns 
 */
export function GridContainer(props: GridContainerProps)
{
	return <div class={S.grid}>{props.children}</div>;
}


/**
 * Пустой элемент для выравнивания сетки в ландшафтной ориентации, в портретной ориентации не отображается
 * @returns 
 */
export function GridPadding()
{
	return <div class={S.pad} />;
}