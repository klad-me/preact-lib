import { TimerId } from "../types";


type RunLaterCallback = () => void;

type RunLaterElement = {
	cb: RunLaterCallback;
	callStack?: string;
};


let timer: TimerId | undefined;
const list: RunLaterElement[] = [];


function run(): void
{
	timer=undefined;
	let item: RunLaterElement | undefined;
	while ( (item = list.shift()) !== undefined )
	{
		try
		{
			item.cb();
		} catch (e: any)
		{
			console.error(e.toString());
			if (item.callStack) console.error("Call stack:", item.callStack);
		}
	}
}


/**
 * Выполнить обработчик позже
 * @param cb обработчик
 */
export function runLater(cb: RunLaterCallback): void
{
	list.push({ cb, callStack: (new Error()).stack });
	if (timer === undefined)
		timer=setTimeout(run, 0);
}
