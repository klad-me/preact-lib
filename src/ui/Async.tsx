import S from './Async.module.scss';
import { VNode } from "preact";
import { useEffect, useState } from "preact/hooks";
import { InlineSpinner } from './InlineSpinner';
import { useTr } from '../tr';


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
	const tr = useTr();

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
			return <InlineSpinner text={props.loadingText ?? tr("@preact-lib.loading", "Загрузка...")} center />
		
		case 'done':
			return content || <div/>;
		
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
