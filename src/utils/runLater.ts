import { TimerId } from "../types";


type RunLaterCallback = () => void;

type RunLaterElement = {
	cb: RunLaterCallback;
	callStack: string;
};


let timer: TimerId | undefined;
const list: RunLaterElement[] = [];


function run(): void
{
	timer=undefined;
	while (list.length > 0)
	{
		const { cb, callStack } = list.shift();

		try
		{
			cb();
		} catch (e)
		{
			console.error(e.toString());
			if (callStack) console.error("Call stack:", callStack);
		}
	}
}


export function runLater(cb: RunLaterCallback): void
{
	list.push({ cb, callStack: (new Error()).stack });
	if (timer === undefined)
		timer=setTimeout(run, 0);
}
