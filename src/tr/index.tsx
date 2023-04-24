import { ComponentChildren, JSX, createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";


export type TrDatabase = {
	[ key: string ]: string | string[] | TrDatabase;
};


type trFnType = (id: string, text: string, ...args: any[]) => string;
type trListFnType = (id: string, list: string[]) => string[];
type trListNFnType = (id: string, list: string[], index: number, ...args: any[]) => string;

export type trContextType = trFnType & {
	tr: trContextType;
	trList: trListFnType;
	trListN: trListNFnType;
};


function makeContext(db?: TrDatabase): trContextType
{
	function trFn(id: string, text: string, ...args: any[]): string
	{
		// Получаем перевод по id
		let s=findTr(db, id);
		if ('string' == typeof s)
		{
			text=s;
		} else
		if (db !== undefined)
		{
			console.warn("Translation for '"+id+"' not found ("+text+")");
		}

		// Подставляем аргументы
		return replaceArgs(id, text, args);
	}

	function trListFn(id: string, list: string[]): string[]
	{
		// Получаем перевод по id
		let s=findTr(db, id);
		if (Array.isArray(s))
		{
			if (s.length != list.length) console.warn("Translation for '"+id+"' has incorrect array length");
			list=s;
		} else
		if (db !== undefined)
		{
			console.warn("Translation for '"+id+"[]' not found");
		}

		// Возвращаем список
		return list;
	}

	function trListNFn(id: string, list: string[], index: number, ...args: any[]): string
	{
		list=trListFn(id, list);
		const text = list[index] ?? '';
		return replaceArgs(id+'['+index+']', text, args);
	}

	trFn.tr=trFn;
	trFn.trList=trListFn;
	trFn.trListN=trListNFn;

	return trFn;
}


const trContext = createContext<trContextType>(makeContext());


type TrProviderProps = {
	tr?: TrDatabase;
	children: ComponentChildren;
};


export function TrProvider(props: TrProviderProps)
{
	const ctx = useMemo(() => makeContext(props.tr), [props.tr]);

	return (
		<trContext.Provider value={ctx}>
			{props.children}
		</trContext.Provider>
	);
}


function findTr(db: TrDatabase | undefined, id: string): string | string[] | undefined
{
	let s: TrDatabase | string | string[] | undefined = db;
	id.split('.').forEach( (item) => {
		if ( ('object' == typeof s) && (! Array.isArray(s)) )
			s=s[item];
	});
	if ( (Array.isArray(s) && ('string' == typeof s[0])) || ('string' == typeof s) )
		return s; else
		return undefined;
}


function replaceArgs(id: string, text: string, args: any[]): string
{
	return text.replace(/%\d/g, (s: string) => {
		let n = Number(s[1]);
		let arg=args[n-1];
		if ( (arg === undefined) || (n == 0) )
		{
			console.warn("Argument %"+n+" not found for '"+id+"' ("+text+")")
			arg='';
		}
		return String(arg);
	});
}


export function useTr()
{
	return useContext(trContext);
}


export const UseTr = trContext.Consumer;
