import { ComponentChildren, JSX, createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";


/**
 * Тип для описания базы перевода
 */
export type TrDatabase = {
	[ key: string ]: string | string[] | TrDatabase;
};


/**
 * Функция для перевода строки с подстановкой аргументов
 * @param id идентификатор строки
 * @param text текст по-умолчанию
 * @param args аргументы %1..%9
 * @returns перевод текста
 */
export type trFnType = (id: string, text: string, ...args: any[]) => string;

/**
 * Функция для перевода списка
 * @param id идентификатор списка
 * @param list список по-умолчанию
 * @returns перевод списка
 */
export type trListFnType = (id: string, list: string[]) => string[];

/**
 * Функция для перевода элемента списка с подстановкой аргументов
 * @param id идентификатор списка
 * @param list список по-умолчанию
 * @param index индекс элемента списка
 * @param args аргументы %1..%9
 * @return перевод элемента списка
 */
export type trListNFnType = (id: string, list: string[], index: number, ...args: any[]) => string;

/**
 * Контекст для перевода
 */
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


/**
 * Аттрибуты для переводчика интерфейса
 */
export type TrProviderProps = {
	/** База переводов, если undefined - будет возвращаться текст по-умолчанию */
	tr?: TrDatabase;

	/** Элементы для перевода */
	children: ComponentChildren;
};


/**
 * Источник перевода интерфейса
 * @param props аттрибуты
 * @returns 
 * 
 * @example
 * <TrProvider tr={en_json}>
 *   <Application />
 * </TrProvider>
 */
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


/**
 * Хук, возвращающий текущий переводчик интерфейса
 * @returns функции для перевода
 * 
 * @example
 * // Можно использовать просто tr()
 * const tr = useTr();
 * 
 * // Можно использовать tr(), trList(), trListN()
 * const { tr, trList, trListN } = useTr();
 */
export function useTr()
{
	return useContext(trContext);
}


/**
 * Cunsomer-обертка для контекста перевода для использования в класс-компонентах
 * 
 * @example
 * render() {
 *   return (
 *     <UseTr>
 *       {(tr) => tr("hello.world", "Hello world")}
 *     </UseTr>
 *   );
 * }
 */
export const UseTr = trContext.Consumer;
