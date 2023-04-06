import { useMemo, useEffect, Inputs } from "preact/hooks";


export type EventCallback<ArgType> = (arg: ArgType) => void;


export class Event<ArgType>
{
	protected list = new Set<EventCallback<ArgType>>();

	constructor()
	{
	}

	on(cb: EventCallback<ArgType>): void
	{
		this.list.add(cb);
	}

	off(cb: EventCallback<ArgType>): void
	{
		this.list.delete(cb);
	}

	use(cb: EventCallback<ArgType>, inputs?: Inputs): void
	{
		useEffect( () => {
			this.on(cb);
			return () => this.off(cb);
		}, [inputs]);
	}

	emit = (arg: ArgType): void =>
	{
		this.list.forEach( (cb) => cb(arg) );
	}
};


export function useEvent<ArgType>()
{
    return useMemo( () => new Event<ArgType>(), [] );
}
