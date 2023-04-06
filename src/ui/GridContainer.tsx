import S from './GridContainer.module.scss';
import { ComponentChildren } from 'preact';


type GridContainerProps = {
	children: ComponentChildren;
};

export function GridContainer({children}: GridContainerProps)
{
	return <div class={S.grid}>{children}</div>;
}


export function GridPadding()
{
	return <div class={S.pad} />;
}