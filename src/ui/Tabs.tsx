import clsx from 'clsx';
import S from './Tabs.module.scss';

import { ComponentChildren, toChildArray, VNode } from 'preact';
import { useState, useMemo } from 'preact/hooks';


type TabProps = {
	name: string;
	children: ComponentChildren;
};

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


type TabContainerProps = {
	buttons?: 'top' | 'bottom';
	current?: number;
	children: ComponentChildren;
};


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

	const buttons = <TabButtons names={names} current={current} onChange={setCurrent} position={props.buttons} />;

	return (
		<div class={S.tabs}>
			{(props.buttons != 'bottom') && buttons}
			<div>{tabs.map( (tab, idx) => <div class={(idx != current) && 'hide'}>{tab}</div> )}</div>
			{(props.buttons == 'bottom') && buttons}
		</div>
	)
}