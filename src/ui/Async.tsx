import S from './Async.module.scss';
import { VNode } from "preact";
import { useEffect, useState } from "preact/hooks";
import { InlineSpinner } from './InlineSpinner';


type AsyncState = 'loading' | 'done' | 'failed';


type AsyncProps = {
	loader: () => Promise<VNode>;
	loadingText?: string;
	errorText?: string;
};


export function Async(props: AsyncProps): VNode
{
	const [ state, setState ] = useState<AsyncState>('loading');
	const [ content, setContent ] = useState<VNode | undefined>();

	useEffect( () => {
		props.loader()
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
			return <InlineSpinner text={props.loadingText ?? 'Загрузка...'} center />
		
		case 'done':
			return content || <div/>;
		
		case 'failed':
		default:
			return (
				<div class={S.failed}>
					<div class={S.failedText}>{props.errorText ?? 'Ошибка загрузки'}</div>
					{content}
				</div>
			);
	}
}
