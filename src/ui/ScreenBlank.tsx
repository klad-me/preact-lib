import S from './ScreenBlank.module.scss';

import { useState, useEffect } from 'preact/hooks';
import clsx from 'clsx';
import { Event } from '../hooks';


const ev = new Event<boolean>();
let blankCount=0;


/** Элемент, используемый для затенения экрана. Требуется определить только в одном месте. */
export function ScreenBlankElement()
{
	const [ blank, setBlank ] = useState(false);
	ev.use(setBlank);
	return <div class={clsx(S.blank, ! blank && 'hide')} />
}


/**
 * Затенить экран. Должен быть соответствующий вызов {@link unblankScreen}
 */
export function blankScreen()
{
	blankCount++;
	if (blankCount > 0) ev.emit(true);
}


/**
 * Убрать затенение экрана. Экран ранее должен быть затененным через {@link blankScreen}
 */
export function unblankScreen()
{
	blankCount--;
	if (blankCount == 0) ev.emit(false);
}


/**
 * Хук, управляющий затенением экрана
 * @param on включение затенения
 */
export function useScreenBlank(on: boolean = true)
{
	useEffect( () => {
		if (on)
		{
			blankScreen();
			return unblankScreen;
		}
	}, [on])
}
