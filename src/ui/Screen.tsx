import S from './Screen.module.scss';
import { ComponentChildren } from "preact";


type ScreenProps = {
	children: ComponentChildren;
};


export function Screen(props: ScreenProps)
{
	return <div class={S.screen}>{props.children}</div>
}