import S from './Spinner.module.scss';

import { useEffect, useState } from 'preact/hooks';
import { Event } from '../hooks';
import { useScreenBlank } from './ScreenBlank';
import clsx from 'clsx';

const ev = new Event<boolean>();
let spinnerCount=0;


export function SpinnerElement()
{
	const [ visible, setVisible ] = useState(false);
	ev.use(setVisible);

	return <div class={clsx(S.spinner, ! visible && 'hide')} />;
}


export function showSpinner()
{
	spinnerCount++;
	if (spinnerCount > 0) ev.emit(true);
}


export function hideSpinner()
{
	spinnerCount--;
	if (spinnerCount == 0) ev.emit(false);
}


export function useSpinner(on: boolean = true)
{
	useScreenBlank(on);
	
	useEffect( () => {
		if (on)
		{
			showSpinner();
			return hideSpinner;
		}
	}, [on]);
}
