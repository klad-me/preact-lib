import S from './ScreenBlank.module.scss';

import { useState, useEffect } from 'preact/hooks';
import clsx from 'clsx';
import { Event } from 'hooks';


const ev = new Event<boolean>();
let blankCount=0;


export function ScreenBlankElement()
{
	const [ blank, setBlank ] = useState(false);
	ev.use(setBlank);
	return <div class={clsx(S.blank, ! blank && 'hide')} />
}


export function blankScreen()
{
	blankCount++;
	if (blankCount > 0) ev.emit(true);
}


export function unblankScreen()
{
	blankCount--;
	if (blankCount == 0) ev.emit(false);
}


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
