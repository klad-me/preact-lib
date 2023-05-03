import { useMemo } from 'preact/hooks';
import S from './ProgressBar.module.scss';


/**
 * Аттрибуты для \<ProgressBar/>
 */
export type ProgressBarProps = {
	/** Процент прогресса 0..100 */
	percent: number;
};


/**
 * Отображает полоску прогресса с указанием процентов в текстовом виде
 */
export function ProgressBar(props: ProgressBarProps)
{
	let percent=Math.round(props.percent);
	if (percent < 0) percent=0; else
	if (percent > 100) percent=100;
	
	return useMemo( () => {
		let percentString=percent + '%';
	
		return (
			<div class={S.progressBar}>
				<div style={{ width: percentString }}>{percentString}</div>
			</div>
		);	
	}, [ percent ] );
}
