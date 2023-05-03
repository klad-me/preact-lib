import { useState } from "preact/hooks";
import { Event } from "./useEvent";


export type Orientation = 'portrait' | 'landscape';


const ev = new Event<Orientation>;


/**
 * Возвращает текущую ориентацию экрана
 * @returns ориентация
 */
export function currentOrientation(): Orientation
{
	if ( ('string' != typeof screen.orientation.type) || (screen.orientation.type.startsWith('portrait')) )
		return 'portrait'; else
		return 'landscape';
}


function onOrientationChange()
{
	ev.emit(currentOrientation());
}


screen.orientation.addEventListener('change', onOrientationChange);
window.addEventListener("orientationchange", onOrientationChange);


/**
 * Хук для получения ориентации и ее изменений
 * @returns ориентация
 */
export function useOrientation(): Orientation
{
	const [ orientation, setOrientation ] = useState(currentOrientation());
	ev.use(setOrientation);
	return orientation;
}
