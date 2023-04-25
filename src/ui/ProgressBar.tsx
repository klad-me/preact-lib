import { useMemo } from 'preact/hooks';
import S from './ProgressBar.module.scss';


type ProgressBarProps = {
	percent: number;
};


export function ProgressBar({percent}: ProgressBarProps)
{
	percent=Math.round(percent);
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
