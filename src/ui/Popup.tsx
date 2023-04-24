import S from './Popup.module.scss';
import clsx from 'clsx';
import { ComponentChild, VNode } from 'preact';
import { useState } from 'preact/hooks';
import { useScreenBlank } from './ScreenBlank';
import { Event } from '../hooks';
import { InlineSpinner } from './InlineSpinner';
import { trContextType } from '../tr';


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
			{popupStack.map( (el, idx, arr) => <div class={clsx((idx != arr.length-1) && 'hide')}>{el}</div> )}
		</div>
	);
}


export function popup(tr: trContextType, header: string, content: string | ComponentChild, onOK?: () => void)
{
	popupStack.push(
		<div>
			<header>{header}</header>
			<p>{content}</p>
			<nav><button class={S.buttonOk} onClick={closePopup.bind(null, onOK)}>{tr("@preact-lib.ok", "OK")}</button></nav>
		</div>
	);
	ev.emit({});
}


export function ask(tr: trContextType, header: string, content: string | ComponentChild, onOk?: () => void, onCancel?: () => void)
{
	popupStack.push(
		<div>
			<header>{header}</header>
			<p>{content}</p>
			<nav>
				<button class={S.buttonOk} onClick={closePopup.bind(null, onOk)}>{tr("@preact-lib.ok", "OK")}</button>
				<button class={S.buttonCancel} onClick={closePopup.bind(null, onCancel)}>{tr("@preact-lib.cancel", "Отмена")}</button>
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


export function waitPromise<T=void>(tr: trContextType, promise: Promise<T>, onDone?: (result: T) => void, onError?: (error: Error) => void, loadingText?: string)
{
	popupStack.push(
		<div>
			<div class={S.waitPromise}>
				<InlineSpinner />
				<span class={S.waitPromiseText}>
					{loadingText ?? tr("@preact-lib.executing", "Выполнение...")}
				</span>
			</div>
		</div>
	);
	ev.emit({});

	promise
		.then( (result: T) => {
			closePopup();
			if ('function' == typeof onDone) onDone(result);
		})
		.catch( (e: Error) => {
			closePopup();
			if ('function' == typeof onError) onError(e);
		});
}


export function closeAllPopups()
{
	popupStack=[];
	ev.emit({});
}
