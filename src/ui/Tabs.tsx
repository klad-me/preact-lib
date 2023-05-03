import S from './Tabs.module.scss';
import clsx from 'clsx';
import { ComponentChildren, toChildArray, VNode } from 'preact';
import { useState, useMemo } from 'preact/hooks';


/** Аттрибуты для \<Tab/> */
export type TabProps = {
	/** Название вкладки */
	name: string;
	/** Содержимое */
	children: ComponentChildren;
};


/**
 * Определить вкладку внутри \<{@link TabContainer}/>
 * @param props аттрибуты
 * @returns 
 */
export function Tab(props: TabProps)
{
	return <> {props.children} </>;
}


type TabButtonsProps = {
	names: string[];
	position: 'top' | 'bottom';
	current: number;
	onChange: (index: number) => void;
};


function TabButtons(props: TabButtonsProps)
{
	return (
		<div class={clsx(S.tabButtons, S[props.position])}>
			{props.names.map( (name, idx) => <div class={clsx(S.tabButton, (idx == props.current) && S.selected)} onClick={() => props.onChange(idx)}>{name}</div>)}
		</div>
	);

}


/** Аттрибуты для \<TabContainer/> */
export type TabContainerProps = {
	/** Расположение кнопок выбора вкладки (по-умолчанию 'top') */
	buttons?: 'top' | 'bottom';
	/** Начальная выбранная вкладка */
	current?: number;
	/** Вкладки, элементы \<{@link Tab}/> */
	children: ComponentChildren;
};


/**
 * Отображает кнопки выбора вкладок и область содержимого
 * @param props аттрибуты
 * @returns 
 * 
 * @example
 * <TabContainer>
 *   <Tab name="Hello">Hello world</Tab>
 *   <Tab name="World">World hello</Tab>
 * </TabContainer>
 */
export function TabContainer(props: TabContainerProps)
{
	const tabs = useMemo( () => 
		(toChildArray(props.children)
		.filter( (c) => 'object' == typeof c ) as VNode<TabProps>[])
		.filter( (c) => c.props.name !== undefined )
		, [props.children] );
	const names = useMemo( () => tabs.map( (el) => el.props.name ), [tabs]);
	const [ current, setCurrent ] = useState(props.current || 0);

	let tabN=current;
	if (tabN < 0) tabN=0;
	if (tabN >= tabs.length) tabN=tabs.length-1;

	const buttons = <TabButtons names={names} current={current} onChange={setCurrent} position={props.buttons ?? 'top'} />;

	return (
		<div class={S.tabs}>
			{(props.buttons != 'bottom') && buttons}
			<div>{tabs.map( (tab, idx) => <div class={clsx((idx != current) && 'hide')}>{tab}</div> )}</div>
			{(props.buttons == 'bottom') && buttons}
		</div>
	)
}