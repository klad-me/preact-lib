import S from './Async.module.scss';
import { useContext, useEffect, useState } from "preact/hooks";
import { InlineSpinner } from './InlineSpinner';
import { useTr } from '../tr';
import { VNode, createContext } from 'preact';


const asyncPropsContext = createContext({});


type AsyncState = 'loading' | 'done' | 'failed';


/**
 * Аттрибуты для \<Async/>
 */
export type AsyncProps<T> = {
	/** Асинхронная функция загрузки контента */
	loader: (props: T) => Promise<VNode>;
	/** Текст, выводимый при загрузке */
	loadingText?: string;
	/** Текст, выводимый при ошибке загрузки */
	errorText?: string;
};


/**
 * Выводит спиннер и текст загрузки, пока асинхронная функция-загрузчик выполняется. Потом выводит результат работы функции
 * @param props аттрибуты
 * @returns 
 * 
 * @example
 * const loader = useCallback( async () => {
 *   await sleep(1000);
 *   return <div>Hello world</div>;
 * }, []);
 * return <Async loader={loader} />;
 */
export function Async<T extends object>(props: AsyncProps<T> & T): VNode
{
	const [ state, setState ] = useState<AsyncState>('loading');
	const [ content, setContent ] = useState<VNode | undefined>();
	const tr = useTr();

	useEffect( () => {
		props.loader(props)
			.then( (result: VNode) => {
				setContent(result);
				setState('done');
			})
			.catch( (e: Error) => {
				setContent(<pre>{e.message}</pre>)
				setState('failed');
				console.log('<Async/> error:', e);
			});
	}, []);

	switch (state)
	{
		case 'loading':
			return <InlineSpinner text={props.loadingText ?? tr("@preact-lib.loading", "Загрузка...")} center />
		
		case 'done':
			return <asyncPropsContext.Provider value={props}>{content ?? <div/>}</asyncPropsContext.Provider>;
		
		case 'failed':
		default:
			return (
				<div class={S.failed}>
					<div class={S.failedText}>{props.errorText ?? tr("@preact-lib.loadFailed", "Ошибка загрузки !")}</div>
					{content}
				</div>
			);
	}
}


export function useAsyncProps<T extends object>()
{
	return useContext(asyncPropsContext) as T;
}