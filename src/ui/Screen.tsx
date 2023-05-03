import S from './Screen.module.scss';
import { ComponentChildren } from "preact";


/** Аттрибуты для \<Screen/> */
export type ScreenProps = {
	/** Содержимое экрана */
	children: ComponentChildren;
};


/**
 * Делит экран браузера на 3 части:<br/>
 * \<header> - заголовок (верхняя часть)<br/>
 * \<main> - основное содержимое (растянуто на всю свободную область, проматываемое)<br/>
 * \<footer> - окончание (нижняя часть)
 * @param props аттрибуты
 * @returns 
 */
export function Screen(props: ScreenProps)
{
	return <div class={S.screen}>{props.children}</div>
}