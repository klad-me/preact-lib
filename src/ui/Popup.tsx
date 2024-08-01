import S from './Popup.module.scss';
import clsx from 'clsx';
import { ComponentChild, VNode } from 'preact';
import { useState } from 'preact/hooks';
import { useScreenBlank } from './ScreenBlank';
import { Event } from '../hooks';
import { InlineSpinner } from './InlineSpinner';
import { trContextType } from '../tr';


/** Аттрибуты для элемента customPopup() */
export type CustomPopupProps = {
	/** Необходимо вызвать для закрытия всплывалки */
	onClose?: () => void;
};

type PopupContent = VNode<CustomPopupProps>;

let popupStack: PopupContent[] = [];
let activePopup: PopupContent | undefined = undefined;
const ev = new Event<object>();


function closePopup(cb?: () => void)
{
	('function' == typeof cb) && cb();
	if (activePopup !== undefined)
	{
		const idx = popupStack.indexOf(activePopup);
		popupStack.splice(idx, 1);
	}
	ev.emit({});
}


/**
 * Элемент, в который будут вставляться всплывалки. Необходимо использовать только где-то в одном месте.
 * @returns 
 */
export function PopupElement()
{
	const [ , update ] = useState({});
	ev.use(update);

	useScreenBlank( popupStack.length > 0 );

	if (popupStack.length > 0)
		activePopup = popupStack[popupStack.length - 1]; else
		activePopup = undefined;

	return (
		<div class={clsx(S.popup, (popupStack.length == 0) && 'hide')}>
			{popupStack.map( (el, idx, arr) => <div class={clsx((idx != arr.length-1) && 'hide')}>{el}</div> )}
		</div>
	);
}


/**
 * Вывести всплывалку с одной кнопкой 'OK'
 * @param tr переводчик интерфейса
 * @param header заголовок
 * @param content содержимое
 * @param onOK обработчик закрытия всплывалки
 */
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


/**
 * Вывести всплывалку запроса с кнопками 'OK' и 'Отмена'
 * @param tr переводчик интерфейса
 * @param header заголовок
 * @param content содержимое
 * @param onOk обработчик нажатия 'OK'
 * @param onCancel обработчик нажатия 'Отмена'
 */
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


/**
 * Вывести всплывалку с указанным элементом внутри.
 * @param content содержимое
 * 
 * @example
 * function MyPopup(props: CustomPopupProps)
 * {
 *   return <div>Hello world <button onClick={props.onClose}>Закрыть</button></div>
 * }
 * 
 * customPopup(<MyPopup />);
 * 
 * @see {@link CustomPopupProps}
 * 
 */
export function customPopup(content: PopupContent)
{
	content.props.onClose=closePopup;
	popupStack.push(content);
	ev.emit({});
}


/**
 * Вывести всплывалку со спиннером ожидания выполнения промиса
 * @param tr переводчик интерфейса
 * @param promise промис, который надо ожидать
 * @param onDone обработчик завершения выполнения
 * @param onError обработчик ошибки выполнения
 * @param loadingText текст в окне ожидания
 */
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



/**
 * Закрыть все открытые всплывалки
 */
export function closeAllPopups()
{
	popupStack=[];
	ev.emit({});
}
