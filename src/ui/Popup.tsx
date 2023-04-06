import S from './Popup.module.scss';

import { ComponentChild, VNode } from 'preact';
import { useState } from 'preact/hooks';
import { useScreenBlank } from './ScreenBlank';
import { Event } from '../hooks';
import clsx from 'clsx';


export type CustomPopupProps = {
	onClose?: () => void;
};

type PopupContent = VNode<CustomPopupProps>;

let popupStack: PopupContent[] = [];
const ev = new Event<object>();


function closePopup(cb?: () => void)
{
	('function' == typeof cb) && cb();
	popupStack.pop();
	ev.emit({});
}


export function PopupElement()
{
	const [ , update ] = useState({});
	ev.use(update);

	useScreenBlank( popupStack.length > 0 );

	return (
		<div class={clsx(S.popup, (popupStack.length == 0) && 'hide')}>
			{popupStack.map( (el, idx, arr) => <div class={(idx != arr.length-1) && 'hide'}>{el}</div> )}
		</div>
	);
}


export function popup(header: string, content: string | ComponentChild, onOk?: () => void)
{
	popupStack.push(
		<div>
			<header>{header}</header>
			<p>{content}</p>
			<nav><button class={S.buttonOk} onClick={closePopup.bind(null, onOk)}>OK</button></nav>
		</div>
	);
	ev.emit({});
}


export function ask(header: string, content: string | ComponentChild, onOk?: () => void, onCancel?: () => void)
{
	popupStack.push(
		<div>
			<header>{header}</header>
			<p>{content}</p>
			<nav>
				<button class={S.buttonOk} onClick={closePopup.bind(null, onOk)}>OK</button>
				<button class={S.buttonCancel} onClick={closePopup.bind(null, onCancel)}>Отмена</button>
			</nav>
		</div>
	);
	ev.emit({});
}


export function customPopup(content: PopupContent)
{
	content.props.onClose=closePopup;
	popupStack.push(content);
	ev.emit({});
}


export function closeAllPopups()
{
	popupStack=[];
	ev.emit({});
}
