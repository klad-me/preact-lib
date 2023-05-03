import S from './Spinner.module.scss';

import { useEffect, useState } from 'preact/hooks';
import { Event } from '../hooks';
import { useScreenBlank } from './ScreenBlank';
import clsx from 'clsx';

const ev = new Event<boolean>();
let spinnerCount=0;


/** Элемент, отображающий полноэкранный спиннер, должен быть определен только в одном месте */
export function SpinnerElement()
{
	const [ visible, setVisible ] = useState(false);
	ev.use(setVisible);

	return <div class={clsx(S.spinner, ! visible && 'hide')} />;
}


/** Показать полноэкранный спиннер. Должен быть соответствующий вызов {@link hideSpinner} */
export function showSpinner()
{
	spinnerCount++;
	if (spinnerCount > 0) ev.emit(true);
}


/** Закрыть полноэкранный спиннер. Ранее спиннер должен быть открыт через {@link showSpinner} */
export function hideSpinner()
{
	spinnerCount--;
	if (spinnerCount == 0) ev.emit(false);
}


/**
 * Хук для управления отображением полноэкранного спиннера
 * @param on включение отображения спиннера
 */
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
